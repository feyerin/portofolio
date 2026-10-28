<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import {
  useAtmosWeather,
  type AtmosLocation,
  type TemperatureUnit,
} from "~/composables/atmos/useAtmosWeather";

type TemperatureTheme =
  | "frozen"
  | "cold"
  | "mild"
  | "warm"
  | "hot"
  | "extreme";

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

function getWeatherMood(code: number) {
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

function weatherIcon(code: number) {
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

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<template>
  <main class="atmos-theme relative min-h-screen" :class="atmosphereClass">
    <!-- Atmospheric background -->
    <div class="atmos-ambient" aria-hidden="true" />
    <div class="atmos-ambient atmos-ambient--secondary" aria-hidden="true" />
    <div class="atmos-grain" aria-hidden="true" />

    <AppContainer>
      <div class="atmos-content relative z-10">
        <!-- Navigation -->
        <header class="atmos-header flex items-center justify-between gap-4 py-5 sm:py-6">
          <NuxtLink
            to="/"
            class="group inline-flex items-center gap-3"
            aria-label="Return to portfolio homepage"
          >
            <span class="atmos-brand-mark flex size-10 items-center justify-center rounded-2xl">
              <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
                <path
                  d="M12 20V9M12 14C7 14 5 11 5 6C10 6 12 9 12 14ZM12 11C12 7 14 4 19 4C19 9 16 11 12 11Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span class="flex flex-col gap-0.5">
              <span class="font-display text-xl font-semibold tracking-tight">
                atmos<span class="opacity-55">.</span>
              </span>
              <span class="text-[9px] font-medium uppercase tracking-[0.2em] opacity-60">
                Weather observatory
              </span>
            </span>
          </NuxtLink>

          <div class="flex items-center gap-2 sm:gap-3">
            <span class="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] opacity-60 sm:inline-flex">
              <span class="atmos-live-dot size-1.5 rounded-full bg-current" />
              Live atmosphere
            </span>

            <button
              type="button"
              class="atmos-glass atmos-unit-toggle inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium"
              :aria-label="`Switch temperature units. Current unit: ${temperatureUnitText}`"
              @click="toggleUnit"
            >
              <span :class="unit === 'celsius' ? 'font-semibold' : 'opacity-50'">
                °C
              </span>
              <span class="mx-0.5 opacity-30">/</span>
              <span :class="unit === 'fahrenheit' ? 'font-semibold' : 'opacity-50'">
                °F
              </span>
            </button>
          </div>
        </header>

        <!-- Intro -->
        <section class="grid gap-6 pb-7 pt-9 sm:pb-10 sm:pt-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div class="atmos-reveal max-w-2xl">
            <p class="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] opacity-65">
              <span class="h-px w-6 bg-current opacity-60" />
              Your window to the atmosphere
            </p>

            <h1 class="font-display text-4xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Feel the
              <span class="atmos-title-accent block font-normal italic">
                world around you.
              </span>
            </h1>

            <p class="mt-4 max-w-lg text-sm leading-6 opacity-70 sm:text-base">
              A living snapshot of the sky, shaped by the temperature and
              conditions around you.
            </p>
          </div>

          <div class="atmos-reveal atmos-theme-chip flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs lg:mb-2">
            <span class="atmos-theme-dot size-2 rounded-full bg-current" />
            <span>{{ themeLabel }}</span>
          </div>
        </section>

        <!-- City search -->
        <section class="relative z-30 mb-6" aria-label="Search location">
          <div ref="searchRoot" class="relative max-w-xl">
            <label for="atmos-city-search" class="sr-only">Search for a city</label>

            <div class="atmos-glass atmos-search flex min-h-14 items-center gap-3 rounded-2xl px-4">
              <svg viewBox="0 0 24 24" fill="none" class="size-5 shrink-0 opacity-60" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.5" />
                <path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>

              <input
                id="atmos-city-search"
                :value="searchQuery"
                type="search"
                autocomplete="off"
                placeholder="Explore another place..."
                class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-55"
                @input="onSearchInput"
                @focus="searchOpen = true"
              />

              <span
                v-if="searching"
                class="size-4 animate-spin rounded-full border-2 border-current/20 border-t-current"
                role="status"
                aria-label="Searching"
              />
              <span
                v-else
                class="hidden rounded-md border border-current/15 px-2 py-1 font-mono text-[10px] opacity-50 sm:inline-block"
              >
                CITY
              </span>
            </div>

            <Transition name="atmos-dropdown">
              <div
                v-if="searchOpen && searchQuery.trim().length >= 2"
                class="atmos-glass-strong absolute inset-x-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl p-2 shadow-2xl"
                role="listbox"
                aria-label="City search results"
              >
                <p v-if="searching" class="px-3 py-4 text-sm opacity-65" role="status">
                  Finding places...
                </p>

                <p
                  v-else-if="citySearchResults.length === 0"
                  class="px-3 py-4 text-sm opacity-65"
                  role="status"
                >
                  No places found. Try another city name.
                </p>

                <button
                  v-for="location in citySearchResults"
                  :key="`${location.id}-${location.latitude}-${location.longitude}`"
                  type="button"
                  class="atmos-search-result flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left"
                  role="option"
                  :aria-selected="selectedLocation?.id === location.id"
                  @click="chooseCity(location)"
                >
                  <span class="min-w-0">
                    <span class="block truncate text-sm font-medium">
                      {{ location.name }}
                    </span>
                    <span class="mt-0.5 block truncate text-xs opacity-60">
                      {{ [location.admin1, location.country].filter(Boolean).join(", ") }}
                    </span>
                  </span>

                  <svg viewBox="0 0 24 24" fill="none" class="size-4 shrink-0 opacity-50" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </section>

        <!-- Error state -->
        <section v-if="error" class="atmos-glass atmos-error mb-6 rounded-2xl p-5" role="alert">
          <p class="font-medium">The atmosphere is temporarily unavailable.</p>
          <p class="mt-1 text-sm opacity-70">{{ error }}</p>
          <button
            type="button"
            class="atmos-secondary-button mt-4 min-h-11 rounded-full px-4 text-sm"
            @click="retryWeather"
          >
            {{ hasWeather ? "Try again" : "Search for a city" }}
          </button>
        </section>

        <!-- Current weather -->
        <section class="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]" aria-label="Current weather">
          <article class="atmos-glass-strong atmos-current-card relative min-h-[350px] overflow-hidden rounded-[2rem] p-5 sm:min-h-[400px] sm:p-8 lg:p-10">
            <div class="atmos-card-orb atmos-card-orb--one" aria-hidden="true" />
            <div class="atmos-card-orb atmos-card-orb--two" aria-hidden="true" />

            <div class="relative flex h-full flex-col">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-[10px] font-medium uppercase tracking-[0.2em] opacity-60">
                    Current conditions
                  </p>
                  <h2 class="mt-2 truncate font-display text-2xl font-medium tracking-tight sm:text-3xl">
                    {{ locationName }}
                  </h2>
                  <p class="mt-1 text-sm opacity-65">
                    {{ locationDescription || "Choose a location to begin" }}
                  </p>
                </div>

                <span
                  v-if="hasWeather"
                  class="atmos-live-pill inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[10px] uppercase tracking-wider"
                >
                  <span class="atmos-live-dot size-1.5 rounded-full bg-current" />
                  Live
                </span>
              </div>

              <div
                v-if="loading && !current"
                class="flex flex-1 items-center justify-center py-16"
                role="status"
              >
                <div class="text-center">
                  <div class="atmos-spinner mx-auto size-8 rounded-full border-2 border-current/15 border-t-current" />
                  <p class="mt-4 text-sm opacity-65">Reading the atmosphere...</p>
                </div>
              </div>

              <Transition v-else-if="current" name="atmos-fade" mode="out-in">
                <div :key="`${locationName}-${temperatureLabel}-${weatherCode}`" class="mt-8 flex flex-1 flex-col justify-between gap-8 sm:flex-row sm:items-center">
                  <div class="min-w-0">
                    <p class="text-sm opacity-70">{{ weatherDescription }}</p>
                    <div class="mt-1 flex items-start">
                      <span class="atmos-temperature font-display text-[6rem] font-light leading-none tracking-[-0.09em] sm:text-[8rem]">
                        {{ temperatureLabel }}
                      </span>
                    </div>
                    <p class="mt-3 text-sm opacity-65">
                      Feels like {{ feelsLikeLabel }}
                    </p>
                  </div>

                  <div class="atmos-weather-art flex size-36 shrink-0 items-center justify-center self-center rounded-full sm:size-44" aria-hidden="true">
                    <svg v-if="weatherMood === 'clear'" viewBox="0 0 120 120" fill="none" class="atmos-main-icon size-24 sm:size-32">
                      <circle cx="60" cy="60" r="25" fill="currentColor" opacity=".86" />
                      <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".6">
                        <path d="M60 12v10M60 98v10M12 60h10M98 60h10M26 26l8 8M86 86l8 8M94 26l-8 8M34 86l-8 8" />
                      </g>
                    </svg>

                    <svg v-else-if="weatherMood === 'rain'" viewBox="0 0 120 120" fill="none" class="atmos-main-icon size-24 sm:size-32">
                      <path d="M30 67c-13 0-21-9-21-20s9-20 21-20c5-15 18-23 32-19 12 3 19 12 20 23 13 0 23 9 23 20 0 10-8 16-19 16H30Z" fill="currentColor" opacity=".72" />
                      <g stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".75">
                        <path d="m34 80-5 12M59 80l-5 12M84 80l-5 12" />
                      </g>
                    </svg>

                    <svg v-else-if="weatherMood === 'snow'" viewBox="0 0 120 120" fill="none" class="atmos-main-icon size-24 sm:size-32">
                      <path d="M30 67c-13 0-21-9-21-20s9-20 21-20c5-15 18-23 32-19 12 3 19 12 20 23 13 0 23 9 23 20 0 10-8 16-19 16H30Z" fill="currentColor" opacity=".65" />
                      <g stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M35 82v12m-5-9 10 6m0-6-10 6M61 82v12m-5-9 10 6m0-6-10 6M87 82v12m-5-9 10 6m0-6-10 6" />
                      </g>
                    </svg>

                    <svg v-else viewBox="0 0 120 120" fill="none" class="atmos-main-icon size-24 sm:size-32">
                      <path d="M30 78c-13 0-21-9-21-20s9-20 21-20c5-15 18-23 32-19 12 3 19 12 20 23 13 0 23 9 23 20 0 10-8 16-19 16H30Z" fill="currentColor" opacity=".75" />
                      <circle cx="85" cy="28" r="12" fill="currentColor" opacity=".22" />
                    </svg>
                  </div>
                </div>
              </Transition>

              <div v-else class="flex flex-1 flex-col items-start justify-center py-12">
                <p class="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                  A world waiting to be explored.
                </p>
                <p class="mt-3 max-w-sm text-sm leading-6 opacity-65">
                  Search for a city above to discover its current temperature,
                  atmospheric conditions, and forecast.
                </p>
              </div>

              <div class="mt-8 flex items-center justify-between gap-3 border-t border-current/10 pt-4 text-xs opacity-60">
                <span>{{ hasWeather ? themeLabel : "Atmospheric exploration" }}</span>
                <span>Open-Meteo data</span>
              </div>
            </div>
          </article>

          <!-- Weather metrics -->
          <div class="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <article class="atmos-glass atmos-metric-card flex min-h-36 flex-col justify-between rounded-[1.5rem] p-4 sm:p-5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs opacity-65">Humidity</span>
                <svg viewBox="0 0 24 24" fill="none" class="atmos-metric-icon size-5 opacity-65" aria-hidden="true">
                  <path d="M12 3s7 7 7 12a7 7 0 1 1-14 0c0-5 7-12 7-12Z" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div>
                <p class="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {{ humidityLabel }}
                </p>
                <p class="mt-1 text-xs opacity-55">Relative humidity</p>
              </div>
            </article>

            <article class="atmos-glass atmos-metric-card flex min-h-36 flex-col justify-between rounded-[1.5rem] p-4 sm:p-5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs opacity-65">Wind speed</span>
                <svg viewBox="0 0 24 24" fill="none" class="atmos-metric-icon size-5 opacity-65" aria-hidden="true">
                  <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2 2 0 1 1-2 2M4 16h8a3 3 0 1 1-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </div>
              <div>
                <p class="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {{ windLabel }}
                </p>
                <p class="mt-1 text-xs opacity-55">Surface wind</p>
              </div>
            </article>

            <article class="atmos-glass atmos-metric-card col-span-2 flex min-h-28 flex-col justify-between rounded-[1.5rem] p-4 sm:p-5 lg:col-span-1">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs opacity-65">Precipitation</span>
                <svg viewBox="0 0 24 24" fill="none" class="atmos-metric-icon size-5 opacity-65" aria-hidden="true">
                  <path d="M12 3s7 7 7 12a7 7 0 1 1-14 0c0-5 7-12 7-12Z" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </div>
              <div>
                <p class="font-display text-2xl font-medium tracking-tight">
                  {{ precipitationLabel }}
                </p>
                <p class="mt-1 text-xs opacity-55">Current precipitation</p>
              </div>
            </article>
          </div>
        </section>

        <!-- Hourly forecast -->
        <section class="atmos-section py-9 sm:py-12" aria-label="Hourly forecast">
          <div class="mb-5 flex items-end justify-between gap-4">
            <div>
              <p class="text-[10px] uppercase tracking-[0.2em] opacity-55">The next hours</p>
              <h2 class="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
                Through the day
              </h2>
            </div>
            <span class="pb-1 text-xs opacity-55">Hourly forecast</span>
          </div>

          <div
            v-if="loading && hourly.length === 0"
            class="atmos-glass rounded-2xl p-6 text-sm opacity-65"
            role="status"
          >
            Gathering hourly conditions...
          </div>

          <div
            v-else-if="hourly.length === 0"
            class="atmos-glass rounded-2xl p-6 text-sm opacity-65"
          >
            Choose a city to see its hourly forecast.
          </div>

          <div v-else class="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
            <article
              v-for="(item, index) in hourly.slice(0, 8)"
              :key="item.time"
              class="atmos-glass atmos-forecast-card flex min-h-36 flex-col items-center justify-between gap-4 rounded-2xl px-2 py-4 text-center sm:min-h-40 sm:rounded-3xl sm:py-5"
            >
              <span class="text-[10px] uppercase tracking-wider opacity-60">
                {{ formatTime(item.time, index) }}
              </span>

              <div class="atmos-forecast-icon flex size-9 items-center justify-center" aria-hidden="true">
                <svg v-if="weatherIcon(item.weatherCode) === 'sun'" viewBox="0 0 24 24" fill="none" class="size-8">
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>

                <svg v-else-if="weatherIcon(item.weatherCode) === 'rain' || weatherIcon(item.weatherCode) === 'storm'" viewBox="0 0 24 24" fill="none" class="size-8">
                  <path d="M6 15a4 4 0 0 1-.3-8A6 6 0 0 1 17 8a3.5 3.5 0 0 1 1 7H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                  <path d="m9 17-1 3m7-3-1 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>

                <svg v-else-if="weatherIcon(item.weatherCode) === 'snow'" viewBox="0 0 24 24" fill="none" class="size-8">
                  <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>

                <svg v-else viewBox="0 0 24 24" fill="none" class="size-8">
                  <path d="M6 17a4 4 0 0 1-.3-8A6 6 0 0 1 17 10a3.5 3.5 0 0 1 1 7H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>

              <span class="font-display text-xl font-medium tracking-tight">
                {{ formatTemperature(item.temperature) }}
              </span>
              <span class="text-[10px] opacity-55">
                {{ Math.round(item.precipitationProbability) }}% rain
              </span>
            </article>
          </div>
        </section>

        <!-- Seven-day forecast -->
        <section class="atmos-section pb-10 sm:pb-14" aria-label="Seven-day forecast">
          <div class="mb-5 flex items-end justify-between gap-4">
            <div>
              <p class="text-[10px] uppercase tracking-[0.2em] opacity-55">Looking ahead</p>
              <h2 class="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
                The week ahead
              </h2>
            </div>
            <span class="pb-1 text-xs opacity-55">7-day forecast</span>
          </div>

          <div class="atmos-glass atmos-week-card overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
            <div
              v-if="loading && daily.length === 0"
              class="p-6 text-sm opacity-65"
              role="status"
            >
              Gathering the forecast...
            </div>

            <div v-else-if="daily.length === 0" class="p-6 text-sm opacity-65">
              Your seven-day forecast will appear when you select a city.
            </div>

            <div
              v-for="(item, index) in daily.slice(0, 7)"
              :key="item.date"
              class="atmos-day-row grid grid-cols-[0.7fr_1fr_0.7fr] items-center gap-3 border-b border-current/10 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_1fr_1fr] sm:px-6"
            >
              <div>
                <p class="text-sm font-medium">{{ formatDay(item.date, index) }}</p>
                <p class="mt-1 text-[10px] opacity-50">{{ item.date }}</p>
              </div>

              <div class="flex items-center justify-center gap-2">
                <svg v-if="weatherIcon(item.weatherCode) === 'sun'" viewBox="0 0 24 24" fill="none" class="atmos-forecast-icon size-6" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>

                <svg v-else-if="weatherIcon(item.weatherCode) === 'rain' || weatherIcon(item.weatherCode) === 'storm'" viewBox="0 0 24 24" fill="none" class="atmos-forecast-icon size-6" aria-hidden="true">
                  <path d="M6 15a4 4 0 0 1-.3-8A6 6 0 0 1 17 8a3.5 3.5 0 0 1 1 7H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                  <path d="m9 17-1 3m7-3-1 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>

                <svg v-else-if="weatherIcon(item.weatherCode) === 'snow'" viewBox="0 0 24 24" fill="none" class="atmos-forecast-icon size-6" aria-hidden="true">
                  <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>

                <svg v-else viewBox="0 0 24 24" fill="none" class="atmos-forecast-icon size-6" aria-hidden="true">
                  <path d="M6 17a4 4 0 0 1-.3-8A6 6 0 0 1 17 10a3.5 3.5 0 0 1 1 7H6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>

                <span class="hidden text-xs opacity-60 sm:inline">
                  {{ describeWeather(item.weatherCode) }}
                </span>
              </div>

              <div class="flex items-center justify-end gap-3 text-sm">
                <span class="font-medium">
                  {{ formatTemperature(item.temperatureMax) }}
                </span>
                <span class="opacity-50">
                  {{ formatTemperature(item.temperatureMin) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="atmos-footer flex flex-col gap-3 py-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <p>ATMOS — An exploration of the living sky.</p>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            class="w-fit underline decoration-current/30 underline-offset-4 transition hover:opacity-100"
          >
            Weather data by Open-Meteo
          </a>
        </footer>
      </div>
    </AppContainer>
  </main>
</template>

<style scoped>
.atmos-theme {
  --atmos-bg: #f2f1e9;
  --atmos-ink: #28352f;
  --atmos-glass: rgb(255 255 255 / 30%);
  --atmos-glass-strong: rgb(255 255 255 / 46%);
  --atmos-border: rgb(255 255 255 / 62%);
  --atmos-glow: rgb(201 218 184 / 65%);
  --atmos-glow-secondary: rgb(230 221 191 / 50%);
  --atmos-shadow: rgb(58 73 57 / 9%);

  position: relative;
  isolation: isolate;
  overflow: clip;
  color: var(--atmos-ink);
  background: var(--atmos-bg);
  transition:
    background-color 1.2s ease,
    color 1.2s ease;
}

.atmos-theme--frozen {
  --atmos-bg: #e8f0f3;
  --atmos-ink: #273e4c;
  --atmos-glow: rgb(161 213 234 / 65%);
  --atmos-glow-secondary: rgb(205 226 241 / 65%);
  --atmos-shadow: rgb(46 81 103 / 10%);
}

.atmos-theme--cold {
  --atmos-bg: #e9eeeb;
  --atmos-ink: #344942;
  --atmos-glow: rgb(176 208 196 / 65%);
  --atmos-glow-secondary: rgb(206 218 205 / 58%);
  --atmos-shadow: rgb(45 74 61 / 9%);
}

.atmos-theme--mild {
  --atmos-bg: #f1f1e8;
  --atmos-ink: #303e32;
  --atmos-glow: rgb(196 220 175 / 68%);
  --atmos-glow-secondary: rgb(227 221 183 / 56%);
  --atmos-shadow: rgb(60 76 48 / 9%);
}

.atmos-theme--warm {
  --atmos-bg: #f5ecdc;
  --atmos-ink: #594333;
  --atmos-glow: rgb(255 204 134 / 66%);
  --atmos-glow-secondary: rgb(246 185 150 / 52%);
  --atmos-shadow: rgb(106 68 37 / 10%);
}

.atmos-theme--hot {
  --atmos-bg: #f4e7d9;
  --atmos-ink: #674333;
  --atmos-glow: rgb(255 172 105 / 65%);
  --atmos-glow-secondary: rgb(248 203 136 / 55%);
  --atmos-shadow: rgb(117 63 35 / 11%);
}

.atmos-theme--extreme {
  --atmos-bg: #f0dfd7;
  --atmos-ink: #633c35;
  --atmos-glow: rgb(245 142 111 / 60%);
  --atmos-glow-secondary: rgb(245 188 126 / 52%);
  --atmos-shadow: rgb(112 53 43 / 11%);
}

/* Weather mood subtly changes the lighting without replacing the temperature palette. */
.atmos-weather--clear {
  --atmos-mood-glow: rgb(255 239 167 / 34%);
}

.atmos-weather--cloudy {
  --atmos-mood-glow: rgb(192 207 215 / 34%);
}

.atmos-weather--rain {
  --atmos-mood-glow: rgb(135 178 211 / 40%);
}

.atmos-weather--snow {
  --atmos-mood-glow: rgb(219 239 250 / 48%);
}

.atmos-ambient {
  position: absolute;
  z-index: -2;
  top: -18rem;
  right: -15rem;
  width: min(78vw, 72rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--atmos-glow);
  filter: blur(100px);
  opacity: 0.8;
  pointer-events: none;
  animation: atmos-drift 22s ease-in-out infinite alternate;
  transition: background 1.4s ease;
}

.atmos-ambient--secondary {
  top: 32rem;
  right: auto;
  left: -22rem;
  width: min(70vw, 64rem);
  background: var(--atmos-glow-secondary);
  opacity: 0.8;
  animation-duration: 27s;
  animation-delay: -8s;
}

.atmos-grain {
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: 0.14;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E");
  background-size: 180px;
  mix-blend-mode: soft-light;
}

.atmos-content {
  animation: atmos-page-enter 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.atmos-header {
  border-bottom: 1px solid rgb(255 255 255 / 35%);
}

.atmos-brand-mark {
  color: var(--atmos-ink);
  background: rgb(255 255 255 / 37%);
  border: 1px solid var(--atmos-border);
  box-shadow:
    0 6px 18px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 70%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition:
    transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1),
    background 300ms ease;
}

.group:hover .atmos-brand-mark {
  transform: rotate(-7deg) translateY(-2px);
  background: rgb(255 255 255 / 58%);
}

.atmos-glass,
.atmos-glass-strong {
  color: inherit;
  border: 1px solid var(--atmos-border);
  box-shadow:
    0 10px 34px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 60%);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
  transition:
    background 350ms ease,
    border-color 350ms ease,
    box-shadow 350ms ease,
    transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.atmos-glass {
  background: var(--atmos-glass);
}

.atmos-glass-strong {
  background: var(--atmos-glass-strong);
  border-color: rgb(255 255 255 / 70%);
  box-shadow:
    0 24px 70px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 78%),
    inset 0 -1px 0 rgb(255 255 255 / 16%);
}

.atmos-unit-toggle:hover {
  background: rgb(255 255 255 / 58%);
  box-shadow: 0 8px 24px var(--atmos-shadow);
}

.atmos-title-accent {
  color: color-mix(in srgb, var(--atmos-ink) 68%, transparent);
}

.atmos-theme-chip {
  border: 1px solid rgb(255 255 255 / 55%);
  background: rgb(255 255 255 / 23%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 45%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.atmos-theme-dot {
  box-shadow: 0 0 12px currentColor;
  animation: atmos-dot-breathe 3s ease-in-out infinite;
}

.atmos-live-dot {
  box-shadow: 0 0 10px currentColor;
  animation: atmos-live-pulse 2.4s ease-in-out infinite;
}

.atmos-search {
  box-shadow:
    0 12px 32px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 65%);
}

.atmos-search:focus-within {
  border-color: rgb(255 255 255 / 95%);
  background: rgb(255 255 255 / 58%);
  box-shadow:
    0 0 0 4px rgb(255 255 255 / 18%),
    0 16px 40px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 80%);
}

.atmos-search-result {
  transition:
    background 220ms ease,
    transform 220ms ease;
}

.atmos-search-result:hover {
  background: rgb(255 255 255 / 46%);
}

.atmos-search-result:active {
  transform: scale(0.99);
}

.atmos-current-card {
  box-shadow:
    0 25px 80px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 80%),
    inset 0 -1px 0 rgb(255 255 255 / 20%);
}

.atmos-card-orb {
  position: absolute;
  width: 17rem;
  aspect-ratio: 1;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(55px);
  transition:
    background 1.4s ease,
    opacity 1.4s ease;
}

.atmos-card-orb--one {
  top: -9rem;
  right: -6rem;
  background: var(--atmos-mood-glow, var(--atmos-glow));
  opacity: 0.75;
  animation: atmos-orb-float 12s ease-in-out infinite alternate;
}

.atmos-card-orb--two {
  right: 20%;
  bottom: -12rem;
  background: var(--atmos-glow-secondary);
  opacity: 0.45;
  animation: atmos-orb-float 16s ease-in-out infinite alternate-reverse;
}

.atmos-live-pill {
  border: 1px solid rgb(255 255 255 / 60%);
  background: rgb(255 255 255 / 28%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 65%);
}

.atmos-temperature {
  text-shadow: 0 8px 35px rgb(40 53 47 / 7%);
}

.atmos-weather-art {
  position: relative;
  border: 1px solid rgb(255 255 255 / 54%);
  background:
    radial-gradient(circle at 32% 24%, rgb(255 255 255 / 52%), transparent 48%),
    rgb(255 255 255 / 17%);
  box-shadow:
    0 18px 50px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 65%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.atmos-main-icon {
  filter: drop-shadow(0 8px 18px rgb(43 57 43 / 12%));
  animation: atmos-icon-float 5s ease-in-out infinite;
}

.atmos-metric-card {
  position: relative;
  overflow: hidden;
}

.atmos-metric-card::before {
  position: absolute;
  top: -3rem;
  right: -3rem;
  width: 8rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--atmos-glow);
  opacity: 0.16;
  filter: blur(28px);
  content: "";
  pointer-events: none;
  transition:
    opacity 350ms ease,
    transform 500ms ease;
}

.atmos-metric-card:hover {
  transform: translateY(-3px);
  background: rgb(255 255 255 / 45%);
  box-shadow:
    0 18px 40px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 70%);
}

.atmos-metric-card:hover::before {
  opacity: 0.35;
  transform: scale(1.2);
}

.atmos-metric-icon {
  transition: transform 350ms ease;
}

.atmos-metric-card:hover .atmos-metric-icon {
  transform: translateY(-2px) scale(1.08);
}

.atmos-forecast-card {
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 45%);
}

.atmos-forecast-card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgb(255 255 255 / 20%), transparent 60%);
  opacity: 0;
  content: "";
  pointer-events: none;
  transition: opacity 350ms ease;
}

.atmos-forecast-card:hover {
  transform: translateY(-5px);
  background: rgb(255 255 255 / 49%);
  box-shadow:
    0 16px 35px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 70%);
}

.atmos-forecast-card:hover::before {
  opacity: 1;
}

.atmos-forecast-icon {
  filter: drop-shadow(0 4px 8px rgb(40 53 47 / 9%));
  transition: transform 350ms ease;
}

.atmos-forecast-card:hover .atmos-forecast-icon {
  transform: translateY(-2px) scale(1.08);
}

.atmos-week-card {
  box-shadow:
    0 16px 48px var(--atmos-shadow),
    inset 0 1px 0 rgb(255 255 255 / 50%);
}

.atmos-day-row {
  transition:
    background 250ms ease,
    padding 250ms ease;
}

.atmos-day-row:hover {
  background: rgb(255 255 255 / 28%);
}

.atmos-day-row:last-child {
  border-bottom: 0;
}

.atmos-footer {
  border-top: 1px solid rgb(255 255 255 / 40%);
}

.atmos-secondary-button {
  border: 1px solid rgb(255 255 255 / 65%);
  background: rgb(255 255 255 / 25%);
  transition:
    background 250ms ease,
    transform 250ms ease;
}

.atmos-secondary-button:hover {
  background: rgb(255 255 255 / 50%);
}

.atmos-secondary-button:active {
  transform: scale(0.98);
}

.atmos-spinner {
  animation: atmos-spin 0.9s linear infinite;
}

.atmos-dropdown-enter-active,
.atmos-dropdown-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.atmos-dropdown-enter-from,
.atmos-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.99);
  transform-origin: top center;
}

.atmos-fade-enter-active,
.atmos-fade-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.atmos-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.atmos-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes atmos-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-5%, 6%, 0) scale(1.08);
  }
}

@keyframes atmos-orb-float {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-12px, 15px, 0) scale(1.12);
  }
}

@keyframes atmos-icon-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes atmos-dot-breathe {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes atmos-live-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgb(255 255 255 / 20%);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 4px rgb(255 255 255 / 0%);
  }
}

@keyframes atmos-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes atmos-page-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1024px) {
  .atmos-section {
    animation: atmos-page-enter 700ms both;
  }
}

@media (max-width: 640px) {
  .atmos-ambient {
    filter: blur(75px);
  }

  .atmos-card-orb {
    width: 12rem;
    filter: blur(42px);
  }

  .atmos-glass,
  .atmos-glass-strong {
    backdrop-filter: blur(17px) saturate(125%);
    -webkit-backdrop-filter: blur(17px) saturate(125%);
  }

  .atmos-day-row {
    gap: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .atmos-theme *,
  .atmos-theme *::before,
  .atmos-theme *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>