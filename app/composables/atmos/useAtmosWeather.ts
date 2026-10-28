
export type TemperatureUnit = "celsius" | "fahrenheit";

export interface AtmosLocation {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface AtmosCurrentWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
}

export interface AtmosHourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface AtmosDailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface AtmosWeatherData {
  location: AtmosLocation;
  current: AtmosCurrentWeather;
  hourly: AtmosHourlyForecast[];
  daily: AtmosDailyForecast[];
}

interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }>;
}

interface ForecastResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

export function useAtmosWeather() {
  const locations = ref<AtmosLocation[]>([]);
  const weather = ref<AtmosWeatherData | null>(null);

  const searching = ref(false);
  const loading = ref(false);
  const error = ref("");

  const unit = ref<TemperatureUnit>("celsius");

  let searchController: AbortController | null = null;
  let weatherController: AbortController | null = null;

  async function searchCities(query: string) {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
    searchController?.abort();
    searchController = null;
    locations.value = [];
    searching.value = false;
    return;
    }
  
    searchController?.abort();

    const controller = new AbortController();
    searchController = controller;

    searching.value = true;
    error.value = "";

    try {
      const params = new URLSearchParams({
        name: normalizedQuery,
        count: "6",
        language: "en",
        format: "json",
      });

      const response = await fetch(
        `${GEOCODING_URL}?${params.toString()}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Unable to search for locations.");
      }

      const data = (await response.json()) as GeocodingResponse;

      if (searchController !== controller) return;

      locations.value = (data.results ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country,
        admin1: item.admin1,
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone,
      }));
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") {
        return;
      }

      if (searchController === controller) {
        locations.value = [];
        error.value = "City search failed. Please try again.";
      }
    } finally {
      if (searchController === controller) {
        searching.value = false;
      }
    }
  }

  async function fetchWeather(location: AtmosLocation) {
    weatherController?.abort();

    const controller = new AbortController();
    weatherController = controller;

    loading.value = true;
    error.value = "";

    try {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "wind_speed_10m",
          "precipitation",
          "weather_code",
          "is_day",
        ].join(","),
        hourly: [
          "temperature_2m",
          "precipitation_probability",
          "weather_code",
        ].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "sunrise",
          "sunset",
          "uv_index_max",
        ].join(","),
        timezone: "auto",
        forecast_days: "7",
        wind_speed_unit: "kmh",
        temperature_unit: unit.value,
      });

      const response = await fetch(
        `${FORECAST_URL}?${params.toString()}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve weather data.");
      }

      const data = (await response.json()) as ForecastResponse;

      if (weatherController !== controller) return;

      const currentTime = data.current.time;
      const currentHour = currentTime.slice(0, 13);

      const hourlyStartIndex = data.hourly.time.findIndex(
        (time) => time.slice(0, 13) === currentHour,
      );

      const startIndex = hourlyStartIndex >= 0 ? hourlyStartIndex : 0;

      weather.value = {
        location,
        current: {
          time: data.current.time,
          temperature: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        },
        hourly: data.hourly.time
          .slice(startIndex, startIndex + 24)
          .map((time, index) => {
            const actualIndex = startIndex + index;

            return {
              time,
              temperature: data.hourly.temperature_2m[actualIndex] ?? 0,
              precipitationProbability:
                data.hourly.precipitation_probability[actualIndex] ?? 0,
              weatherCode: data.hourly.weather_code[actualIndex] ?? 0,
            };
          }),
        daily: data.daily.time.map((date, index) => ({
          date,
          weatherCode: data.daily.weather_code[index] ?? 0,
          temperatureMax: data.daily.temperature_2m_max[index] ?? 0,
          temperatureMin: data.daily.temperature_2m_min[index] ?? 0,
          sunrise: data.daily.sunrise[index] ?? "",
          sunset: data.daily.sunset[index] ?? "",
          uvIndexMax: data.daily.uv_index_max[index] ?? 0,
        })),
      };
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") {
        return;
      }

      if (weatherController === controller) {
        error.value =
          "Weather data is temporarily unavailable. Please try again.";
      }
    } finally {
      if (weatherController === controller) {
        loading.value = false;
      }
    }
  }

  async function selectLocation(location: AtmosLocation) {
    locations.value = [];
    await fetchWeather(location);
  }

  async function changeUnit(nextUnit: TemperatureUnit) {
    if (unit.value === nextUnit) return;

    unit.value = nextUnit;

    if (weather.value) {
      await fetchWeather(weather.value.location);
    }
  }

  function clearError() {
    error.value = "";
  }

  onScopeDispose(() => {
    searchController?.abort();
    weatherController?.abort();
  });

  return {
    locations,
    weather,
    searching,
    loading,
    error,
    unit,
    searchCities,
    selectLocation,
    fetchWeather,
    changeUnit,
    clearError,
  };
}
