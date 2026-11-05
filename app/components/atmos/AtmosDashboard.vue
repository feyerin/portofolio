<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import {
  useAtmosWeather,
  type AtmosLocation,
  type TemperatureUnit,
} from "~/composables/atmos/useAtmosWeather";
import {
  renderAtmosIcons,
  renderFall,
  renderScene,
  type Mood,
  type TempTheme,
  type WeatherIconName,
} from "~/assets/pixelart/atmosArt";

type TemperatureTheme = TempTheme;

const {
  locations,
  weather,
  loading,
  error,
  searching,
  unit,
  searchCities,
  selectLocation,
  fetchWeather,
  changeUnit,
  clearError,
} = useAtmosWeather();

const searchQuery = ref("");
const searchOpen = ref(false);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const searchRoot = ref<HTMLElement | null>(null);

const current = computed(() => weather.value?.current ?? null);
const hourly = computed(() => weather.value?.hourly ?? []);
const daily = computed(() => weather.value?.daily ?? []);
const selectedLocation = computed(() => weather.value?.location ?? null);
const hasWeather = computed(() => Boolean(weather.value));
const isDay = computed(() => current.value?.isDay ?? true);

const temperatureCelsius = computed<number | null>(() => {
  const value = current.value?.temperature;

  if (typeof value !== "number") return null;

  return unit.value === "fahrenheit" ? ((value - 32) * 5) / 9 : value;
});

const temperatureTheme = computed<TemperatureTheme>(() => {
  const temperature = temperatureCelsius.value;

  if (temperature === null) return "mild";
  if (temperature < 10) return "frozen";
  if (temperature < 20) return "cold";
  if (temperature < 25) return "mild";
  if (temperature < 30) return "warm";
  if (temperature < 35) return "hot";

  return "extreme";
});

const weatherCode = computed(() => current.value?.weatherCode ?? 0);

function getWeatherMood(code: number): Mood {
  if ([0, 1].includes(code)) return "clear";

  if ([2, 3, 45, 48].includes(code)) return "cloudy";

  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
    ].includes(code)
  ) {
    return "rain";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "snow";
  }

  return "cloudy";
}

const weatherMood = computed(() => getWeatherMood(weatherCode.value));

const atmosphereClass = computed(() => [
  `atmos-theme--${temperatureTheme.value}`,
  `atmos-weather--${weatherMood.value}`,
]);

const temperatureUnitLabel = computed(() =>
  unit.value === "fahrenheit" ? "°F" : "°C",
);

const temperatureUnitText = computed(() =>
  unit.value === "fahrenheit" ? "fahrenheit" : "celsius",
);

const locationName = computed(
  () => selectedLocation.value?.name ?? "Explore the atmosphere",
);

const locationDescription = computed(() => {
  const location = selectedLocation.value;

  return [location?.admin1, location?.country].filter(Boolean).join(", ");
});

function describeWeather(code: number) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Misty atmosphere";
  if ([51, 53, 55, 56, 57].includes(code)) return "Light drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rain showers";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowfall";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Atmospheric conditions";
}

const weatherDescription = computed(() => describeWeather(weatherCode.value));

const temperatureLabel = computed(() =>
  formatTemperature(current.value?.temperature),
);

const feelsLikeLabel = computed(() =>
  formatTemperature(current.value?.feelsLike),
);

const windLabel = computed(() => {
  const value = current.value?.windSpeed;

  if (typeof value !== "number") return "--";

  const converted =
    unit.value === "fahrenheit" ? value / 1.609344 : value;

  return `${Math.round(converted)} ${
    unit.value === "fahrenheit" ? "mph" : "km/h"
  }`;
});

const humidityLabel = computed(() => {
  const value = current.value?.humidity;

  return typeof value === "number" ? `${Math.round(value)}%` : "--";
});

const precipitationLabel = computed(() => {
  const value = current.value?.precipitation;

  return typeof value === "number" ? `${value.toFixed(1)} mm` : "--";
});

const themeLabel = computed(() => {
  const labels: Record<TemperatureTheme, string> = {
    frozen: "Frozen atmosphere",
    cold: "Misty morning",
    mild: "Fresh nature",
    warm: "Golden hour",
    hot: "Sunlit atmosphere",
    extreme: "Extreme heat",
  };

  return labels[temperatureTheme.value];
});

const citySearchResults = computed(() => locations.value);

function formatTemperature(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "--°";

  return `${Math.round(value)}${temperatureUnitLabel.value}`;
}

function formatTime(value: string, index: number) {
  if (index === 0) return "NOW";

  const hour = value.match(/T(\d{2}):\d{2}/)?.[1];

  if (hour === undefined) return value;

  const hourNumber = Number(hour);
  const period = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = hourNumber % 12 || 12;

  return `${displayHour} ${period}`;
}

function formatDay(value: string, index: number) {
  if (index === 0) return "TODAY";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return value;

  const [, year, month, day] = match;
  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function weatherIcon(code: number): WeatherIconName {
  if ([0, 1].includes(code)) return "sun";
  if (code === 2) return "partly-cloudy";
  if ([3, 45, 48].includes(code)) return "cloud";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
  ) {
    return "rain";
  }

  return "cloud";
}

/** Ikon utama: langit cerah di malam hari tampil sebagai bulan. */
const mainIcon = computed<WeatherIconName>(() => {
  const icon = weatherIcon(weatherCode.value);

  return icon === "sun" && !isDay.value ? "moon" : icon;
});

/** Rentang suhu mingguan untuk bar di daftar 7 hari. */
const weekRange = computed(() => {
  const days = daily.value.slice(0, 7);

  if (days.length === 0) return { min: 0, span: 1 };

  const min = Math.min(...days.map((day) => day.temperatureMin));
  const max = Math.max(...days.map((day) => day.temperatureMax));

  return { min, span: Math.max(1, max - min) };
});

function rangeStyle(item: { temperatureMin: number; temperatureMax: number }) {
  const { min, span } = weekRange.value;
  const left = ((item.temperatureMin - min) / span) * 100;
  const width = Math.max(8, ((item.temperatureMax - item.temperatureMin) / span) * 100);

  return { left: `${left}%`, width: `${Math.min(width, 100 - left)}%` };
}

function onSearchInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  searchQuery.value = value;
  searchOpen.value = true;
  clearError();

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = null;
  }

  if (value.trim().length < 2) {
    void searchCities(value);
    return;
  }

  searchTimeout.value = setTimeout(() => {
    void searchCities(value);
  }, 350);
}

async function chooseCity(location: AtmosLocation) {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = null;
  }

  searchOpen.value = false;
  searchQuery.value = "";
  clearError();

  await selectLocation(location);
}

async function toggleUnit() {
  const nextUnit: TemperatureUnit =
    unit.value === "celsius" ? "fahrenheit" : "celsius";

  await changeUnit(nextUnit);
}

async function retryWeather() {
  const location = weather.value?.location;

  if (!location) {
    error.value = "";
    searchOpen.value = true;
    return;
  }

  await fetchWeather(location);
}

function handleOutsideClick(event: MouseEvent) {
  if (!searchRoot.value?.contains(event.target as Node)) {
    searchOpen.value = false;
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    searchOpen.value = false;
  }
}

watch(selectedLocation, () => {
  searchQuery.value = "";
});

/* ───────── Jendela observatorium (pixel art) ───────── */

const rootEl = ref<HTMLElement | null>(null);
const windowEl = ref<HTMLElement | null>(null);
const sceneCanvas = ref<HTMLCanvasElement | null>(null);
const sceneUnit = ref(5); // 1 pixel game = sceneUnit px layar (bilangan bulat -> tajam)
const sceneCols = ref(0);
const SCENE_ROWS = 44;

let resizeObserver: ResizeObserver | undefined;
let revealObserver: IntersectionObserver | undefined;

function drawScene() {
  if (!sceneCanvas.value || sceneCols.value === 0) return;

  renderScene(sceneCanvas.value, {
    theme: temperatureTheme.value,
    mood: weatherMood.value,
    isDay: isDay.value,
    cols: sceneCols.value,
    rows: SCENE_ROWS,
  });
}

function measureScene() {
  const width = windowEl.value?.clientWidth ?? 0;

  if (!width) return;

  sceneUnit.value = width >= 900 ? 5 : width >= 560 ? 4 : 3;
  sceneCols.value = Math.ceil(width / sceneUnit.value);
}

watch([temperatureTheme, weatherMood, isDay, sceneCols], async () => {
  await nextTick();
  drawScene();
});

watch(weatherMood, (mood) => {
  if (rootEl.value) renderFall(rootEl.value, mood);
});

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);

  const root = rootEl.value;
  if (!root) return;

  renderAtmosIcons(root);
  renderFall(root, weatherMood.value);

  resizeObserver = new ResizeObserver(measureScene);
  if (windowEl.value) resizeObserver.observe(windowEl.value);
  measureScene();

  // Muncul saat di-scroll. Pakai atribut data-*, bukan class: Vue menulis ulang `class`
  // saat atmosphereClass berubah dan akan menghapus penanda yang ditambah manual.
  const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    targets.forEach((target) => target.setAttribute("data-in", ""));
    return;
  }

  root.setAttribute("data-armed", "");
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.setAttribute("data-in", "");
        revealObserver?.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((target) => revealObserver?.observe(target));
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
  resizeObserver?.disconnect();
  revealObserver?.disconnect();

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<template>
  <main ref="rootEl" class="atmos-theme relative min-h-screen" :class="atmosphereClass">
    <div class="atmos-parchment" aria-hidden="true" />
    <div class="atmos-grid" aria-hidden="true" />

    <AppContainer>
      <div class="relative z-10 px-4 sm:px-6 lg:px-8">
        <!-- Navigation -->
        <header class="flex items-center justify-between gap-4 border-b border-gold/40 py-5 sm:py-6">
          <NuxtLink
            to="/"
            class="atmos-brand group inline-flex items-center gap-3"
            aria-label="Return to portfolio homepage"
          >
            <span class="atmos-brand__mark" aria-hidden="true">
              <i class="glyph" data-glyph="arrowLeft" />
            </span>

            <span class="flex flex-col gap-1">
              <span class="font-display text-2xl font-semibold leading-none tracking-tight">
                atmos<span class="text-gold">.</span>
              </span>
              <span class="font-mono text-[10px] tracking-[0.16em] text-label-muted">
                WEATHER OBSERVATORY
              </span>
            </span>
          </NuxtLink>

          <div class="flex items-center gap-3 sm:gap-4">
            <span class="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-label-muted sm:inline-flex">
              <span class="atmos-dot" aria-hidden="true" />
              LIVE SKY
            </span>

            <button
              type="button"
              class="unit-toggle"
              :aria-label="`Switch temperature units. Current unit: ${temperatureUnitText}`"
              @click="toggleUnit"
            >
              <span :class="{ 'is-active': unit === 'celsius' }">°C</span>
              <span :class="{ 'is-active': unit === 'fahrenheit' }">°F</span>
            </button>
          </div>
        </header>

        <!-- Intro -->
        <section data-reveal class="grid gap-6 pb-8 pt-10 sm:pb-10 sm:pt-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div class="max-w-2xl">
            <p class="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-label sm:text-[11px]">
              <span aria-hidden="true" class="h-[3px] w-6 bg-gold" />
              YOUR WINDOW TO THE ATMOSPHERE
            </p>

            <h1 class="m-0 font-display text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Feel the
              <span class="block italic text-wine">world around you.</span>
            </h1>

            <p class="mt-5 max-w-lg text-sm leading-7 text-muted sm:text-base sm:leading-8">
              A living snapshot of the sky, shaped by the temperature and
              conditions around you.
            </p>
          </div>

          <div class="theme-chip">
            <span class="atmos-dot" aria-hidden="true" />
            <span>{{ themeLabel }}</span>
          </div>
        </section>

        <!-- Observatory window: pemandangan pixel art yang bereaksi pada cuaca -->
        <section data-reveal class="mb-8" aria-label="Observatory window">
          <div class="window-frame">
            <div class="window-frame__inner">
              <div ref="windowEl" class="window" :style="{ '--au': sceneUnit + 'px' }">
                <canvas ref="sceneCanvas" class="window__scene" role="img" :aria-label="`Pixel art sky: ${weatherDescription}, ${isDay ? 'daytime' : 'night'}, ${themeLabel}`" />
                <div class="window__fall window__fall--a" aria-hidden="true" />
                <div class="window__fall window__fall--b" aria-hidden="true" />

                <span class="window__tag window__tag--tl">{{ isDay ? "DAYTIME" : "NIGHT WATCH" }}</span>
                <span class="window__tag window__tag--tr">{{ hasWeather ? weatherDescription.toUpperCase() : "AWAITING A PLACE" }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- City search -->
        <section class="relative z-30 mb-8" aria-label="Search location">
          <div ref="searchRoot" class="relative max-w-xl">
            <label for="atmos-city-search" class="sr-only">Search for a city</label>

            <div class="atmos-search">
              <i class="glyph text-label" data-glyph="search" aria-hidden="true" />

              <input
                id="atmos-city-search"
                :value="searchQuery"
                type="search"
                autocomplete="off"
                placeholder="Explore another place..."
                class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-label-muted"
                @input="onSearchInput"
                @focus="searchOpen = true"
              />

              <span
                v-if="searching"
                class="atmos-spinner"
                role="status"
                aria-label="Searching"
              />
              <span
                v-else
                class="hidden border border-gold/45 px-2 py-1 font-mono text-[10px] text-label-muted sm:inline-block"
              >
                CITY
              </span>
            </div>

            <Transition name="atmos-dropdown">
              <div
                v-if="searchOpen && searchQuery.trim().length >= 2"
                class="atmos-results"
                role="listbox"
                aria-label="City search results"
              >
                <p v-if="searching" class="px-3 py-4 text-sm text-muted" role="status">
                  Finding places...
                </p>

                <p
                  v-else-if="citySearchResults.length === 0"
                  class="px-3 py-4 text-sm text-muted"
                  role="status"
                >
                  No places found. Try another city name.
                </p>

                <button
                  v-for="location in citySearchResults"
                  :key="`${location.id}-${location.latitude}-${location.longitude}`"
                  type="button"
                  class="atmos-result"
                  role="option"
                  :aria-selected="selectedLocation?.id === location.id"
                  @click="chooseCity(location)"
                >
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-medium text-ink">
                      {{ location.name }}
                    </span>
                    <span class="mt-0.5 block truncate text-xs text-label-muted">
                      {{ [location.admin1, location.country].filter(Boolean).join(", ") }}
                    </span>
                  </span>

                  <i class="glyph shrink-0 text-gold" data-glyph="arrowRight" aria-hidden="true" />
                </button>
              </div>
            </Transition>
          </div>
        </section>

        <!-- Error state -->
        <section v-if="error" class="atmos-error mb-8" role="alert">
          <p class="m-0 font-display text-xl font-semibold text-wine">The atmosphere is temporarily unavailable.</p>
          <p class="mb-0 mt-1 text-sm text-muted">{{ error }}</p>
          <button type="button" class="atmos-button mt-4" @click="retryWeather">
            {{ hasWeather ? "Try again" : "Search for a city" }}
          </button>
        </section>

        <!-- Current weather -->
        <section data-reveal class="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]" aria-label="Current weather">
          <article class="atmos-panel atmos-current">
            <div class="atmos-panel__bar">
              <span>CURRENT CONDITIONS</span>
              <span v-if="hasWeather" class="inline-flex items-center gap-2 text-wine">
                <span class="atmos-dot" aria-hidden="true" /> LIVE
              </span>
            </div>

            <div class="flex min-h-[320px] flex-col p-5 sm:p-8">
              <div class="min-w-0">
                <h2 class="m-0 truncate font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {{ locationName }}
                </h2>
                <p class="mb-0 mt-1 text-sm text-muted">
                  {{ locationDescription || "Choose a location to begin" }}
                </p>
              </div>

              <div
                v-if="loading && !current"
                class="flex flex-1 items-center justify-center py-12"
                role="status"
              >
                <div class="text-center">
                  <div class="atmos-spinner atmos-spinner--lg mx-auto" />
                  <p class="mt-4 text-sm text-muted">Reading the atmosphere...</p>
                </div>
              </div>

              <Transition v-else-if="current" name="atmos-fade" mode="out-in">
                <div :key="`${locationName}-${temperatureLabel}-${weatherCode}`" class="mt-6 flex flex-1 flex-col justify-between gap-8 sm:flex-row sm:items-center">
                  <div class="min-w-0">
                    <p class="m-0 font-mono text-[11px] tracking-[0.12em] text-label">
                      {{ weatherDescription.toUpperCase() }}
                    </p>
                    <p class="atmos-temperature m-0 mt-2 font-display font-medium leading-none tracking-[-0.06em]">
                      {{ temperatureLabel }}
                    </p>
                    <p class="mb-0 mt-3 text-sm text-muted">
                      Feels like {{ feelsLikeLabel }}
                    </p>
                  </div>

                  <div class="atmos-slot shrink-0 self-center" aria-hidden="true">
                    <i class="wi wi--xl" :data-wi="mainIcon" />
                  </div>
                </div>
              </Transition>

              <div v-else class="flex flex-1 flex-col items-start justify-center py-10">
                <p class="m-0 font-display text-3xl font-medium tracking-tight">
                  A world waiting to be explored.
                </p>
                <p class="mb-0 mt-3 max-w-sm text-sm leading-7 text-muted">
                  Search for a city above to discover its current temperature,
                  atmospheric conditions, and forecast.
                </p>
              </div>

              <div class="mt-8 flex items-center justify-between gap-3 border-t border-dashed border-gold/45 pt-4 font-mono text-[10px] tracking-[0.1em] text-label-muted">
                <span>{{ hasWeather ? themeLabel.toUpperCase() : "ATMOSPHERIC EXPLORATION" }}</span>
                <span>OPEN-METEO DATA</span>
              </div>
            </div>
          </article>

          <!-- Weather metrics -->
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <article class="atmos-panel atmos-metric">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-[10px] tracking-[0.12em] text-label">HUMIDITY</span>
                <i class="glyph text-gold" data-glyph="drop" aria-hidden="true" />
              </div>
              <div>
                <p class="atmos-metric__value">{{ humidityLabel }}</p>
                <p class="mb-0 mt-1 text-xs text-label-muted">Relative humidity</p>
              </div>
            </article>

            <article class="atmos-panel atmos-metric">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-[10px] tracking-[0.12em] text-label">WIND SPEED</span>
                <i class="glyph text-gold" data-glyph="flag" aria-hidden="true" />
              </div>
              <div>
                <p class="atmos-metric__value">{{ windLabel }}</p>
                <p class="mb-0 mt-1 text-xs text-label-muted">Surface wind</p>
              </div>
            </article>

            <article class="atmos-panel atmos-metric col-span-2 lg:col-span-1">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-[10px] tracking-[0.12em] text-label">PRECIPITATION</span>
                <i class="glyph text-gold" data-glyph="umbrella" aria-hidden="true" />
              </div>
              <div>
                <p class="atmos-metric__value">{{ precipitationLabel }}</p>
                <p class="mb-0 mt-1 text-xs text-label-muted">Current precipitation</p>
              </div>
            </article>
          </div>
        </section>

        <!-- Hourly forecast -->
        <section data-reveal class="py-12 sm:py-16" aria-label="Hourly forecast">
          <div class="mb-6 flex items-end justify-between gap-4 border-b border-gold/45 pb-4">
            <div>
              <p class="m-0 font-mono text-[10px] tracking-[0.16em] text-label">THE NEXT HOURS</p>
              <h2 class="mb-0 mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Through the day
              </h2>
            </div>
            <span class="font-mono text-[10px] tracking-widest text-label-muted">HOURLY FORECAST</span>
          </div>

          <div
            v-if="loading && hourly.length === 0"
            class="atmos-note"
            role="status"
          >
            Gathering hourly conditions...
          </div>

          <div v-else-if="hourly.length === 0" class="atmos-note">
            Choose a city to see its hourly forecast.
          </div>

          <ol v-else class="m-0 grid list-none grid-cols-3 gap-2.5 p-0 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
            <li
              v-for="(item, index) in hourly.slice(0, 8)"
              :key="item.time"
              class="atmos-hour"
              :class="{ 'atmos-hour--now': index === 0 }"
            >
              <span class="font-mono text-[10px] tracking-wider text-label">
                {{ formatTime(item.time, index) }}
              </span>

              <i class="wi wi--md" :data-wi="weatherIcon(item.weatherCode)" aria-hidden="true" />

              <span class="font-display text-2xl font-semibold tracking-tight">
                {{ formatTemperature(item.temperature) }}
              </span>

              <span class="inline-flex items-center gap-1.5 font-mono text-[10px] text-label-muted">
                <i class="glyph text-gold" data-glyph="drop" aria-hidden="true" />
                {{ Math.round(item.precipitationProbability) }}%
              </span>
            </li>
          </ol>
        </section>

        <!-- Seven-day forecast -->
        <section data-reveal class="pb-12 sm:pb-16" aria-label="Seven-day forecast">
          <div class="mb-6 flex items-end justify-between gap-4 border-b border-gold/45 pb-4">
            <div>
              <p class="m-0 font-mono text-[10px] tracking-[0.16em] text-label">LOOKING AHEAD</p>
              <h2 class="mb-0 mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                The week ahead
              </h2>
            </div>
            <span class="font-mono text-[10px] tracking-widest text-label-muted">7-DAY FORECAST</span>
          </div>

          <div class="atmos-panel overflow-hidden">
            <div
              v-if="loading && daily.length === 0"
              class="p-6 text-sm text-muted"
              role="status"
            >
              Gathering the forecast...
            </div>

            <div v-else-if="daily.length === 0" class="p-6 text-sm text-muted">
              Your seven-day forecast will appear when you select a city.
            </div>

            <div
              v-for="(item, index) in daily.slice(0, 7)"
              :key="item.date"
              class="atmos-day"
            >
              <div>
                <p class="m-0 font-mono text-[11px] tracking-[0.1em] text-ink">{{ formatDay(item.date, index) }}</p>
                <p class="mb-0 mt-1 font-mono text-[10px] text-label-muted">{{ item.date }}</p>
              </div>

              <div class="flex items-center gap-3">
                <i class="wi wi--sm" :data-wi="weatherIcon(item.weatherCode)" aria-hidden="true" />
                <span class="hidden text-xs text-muted sm:inline">
                  {{ describeWeather(item.weatherCode) }}
                </span>
              </div>

              <div class="atmos-day__temps">
                <span class="atmos-day__min">{{ formatTemperature(item.temperatureMin) }}</span>
                <span class="atmos-range" aria-hidden="true">
                  <span class="atmos-range__fill" :style="rangeStyle(item)" />
                </span>
                <span class="atmos-day__max">{{ formatTemperature(item.temperatureMax) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="flex flex-col gap-3 border-t border-gold/40 py-6 font-mono text-[10px] tracking-[0.1em] text-label-muted sm:flex-row sm:items-center sm:justify-between">
          <p class="m-0">ATMOS — AN EXPLORATION OF THE LIVING SKY.</p>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            class="atmos-credit w-fit"
          >
            WEATHER DATA BY OPEN-METEO
          </a>
        </footer>
      </div>
    </AppContainer>
  </main>
</template>

<style scoped src="~/assets/css/atmos.css"></style>