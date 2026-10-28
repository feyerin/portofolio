
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const isReady = ref(false);
const isExpanded = ref(false);
const volume = ref(0.2);
const hasError = ref(false);

const volumePercent = computed(() => Math.round(volume.value * 100));

async function toggleMusic() {
  const player = audio.value;

  if (!player) return;

  if (isPlaying.value) {
    player.pause();
    isPlaying.value = false;
    return;
  }

  try {
    player.volume = volume.value;
    await player.play();

    isPlaying.value = true;
    hasError.value = false;
  } catch {
    hasError.value = true;
    isPlaying.value = false;
  }
}

function updateVolume() {
  if (audio.value) {
    audio.value.volume = volume.value;

    if (volume.value === 0) {
      audio.value.muted = true;
    } else {
      audio.value.muted = false;
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    isExpanded.value = false;
  }
}

onMounted(() => {
  isReady.value = true;

  if (audio.value) {
    audio.value.volume = volume.value;
  }

  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  audio.value?.pause();
});

watch(volume, updateVolume);
</script>

<template>
  <ClientOnly>
    <div v-if="isReady" class="music-widget">
      <audio
        ref="audio"
        src="/audio/audio.mp3"
        loop
        preload="none"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @error="hasError = true"
      />

      <Transition name="music-panel">
        <div v-if="isExpanded" class="music-panel">
          <div class="panel-heading">
            <span class="pixel-star">✦</span>

            <div>
              <p class="eyebrow">THE ROYAL BARD</p>
              <p class="track-title">Echoes of the Kingdom</p>
            </div>
          </div>

          <div class="track-status">
            <span
              class="status-dot"
              :class="{ 'is-active': isPlaying }"
            />

            {{ hasError
              ? "Audio unavailable"
              : isPlaying
                ? "Now playing"
                : "Ready to play"
            }}
          </div>

          <div class="volume-control">
            <label for="medieval-volume">VOLUME</label>

            <span>{{ volumePercent }}%</span>

            <input
              id="medieval-volume"
              v-model.number="volume"
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              aria-label="Music volume"
            />
          </div>

          <p class="panel-note">
            A soundtrack for your journey.
          </p>
        </div>
      </Transition>

      <div class="music-controls">
        <button
          type="button"
          class="music-info"
          :aria-expanded="isExpanded"
          aria-label="Toggle music settings"
          @click="isExpanded = !isExpanded"
        >
          <span class="info-icon">✧</span>
        </button>

        <button
          type="button"
          class="music-toggle"
          :class="{ 'is-playing': isPlaying }"
          :aria-label="isPlaying ? 'Turn music off' : 'Turn music on'"
          :aria-pressed="isPlaying"
          @click="toggleMusic"
        >
          <span v-if="isPlaying" class="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>

          <svg
            v-else
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.music-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: "IBM Plex Mono", monospace;
}

.music-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.music-toggle,
.music-info {
  display: grid;
  place-items: center;
  color: #f8f3e8;
  background: #713840;
  border: 1px solid #c5a568;
  box-shadow: 4px 4px 0 #382f27;
  cursor: pointer;
  transition:
    transform 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.music-toggle {
  width: 52px;
  height: 52px;
}

.music-info {
  width: 36px;
  height: 36px;
  font-size: 20px;
}

.music-toggle:hover,
.music-info:hover {
  background: #592b32;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #382f27;
}

.music-toggle:active,
.music-info:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #382f27;
}

.music-toggle:focus-visible,
.music-info:focus-visible {
  outline: 2px solid #c5a568;
  outline-offset: 4px;
}

.music-toggle.is-playing {
  color: #f2d69a;
  background: #382f27;
}

.music-panel {
  width: min(290px, calc(100vw - 48px));
  padding: 20px;
  color: #382f27;
  background: #fffdf8;
  border: 1px solid #b39459;
  box-shadow: 6px 6px 0 #382f27;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8ddc8;
}

.pixel-star {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #f8f3e8;
  background: #713840;
  font-size: 22px;
}

.eyebrow {
  color: #8b6a35;
  font-size: 9px;
  letter-spacing: 0.13em;
}

.track-title {
  margin-top: 4px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 20px;
  font-weight: 600;
}

.track-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: #766a59;
  font-size: 10px;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #a49a8a;
}

.status-dot.is-active {
  background: #526b4c;
  box-shadow: 0 0 8px #526b4c80;
}

.volume-control {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 22px;
  font-size: 10px;
  letter-spacing: 0.08em;
}

.volume-control span {
  color: #8b6a35;
}

.volume-control input {
  grid-column: 1 / -1;
  width: 100%;
  accent-color: #8b6a35;
  cursor: pointer;
}

.panel-note {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px dashed #d8c9ac;
  color: #766a59;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 14px;
  font-style: italic;
}

.equalizer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 20px;
}

.equalizer i {
  display: block;
  width: 3px;
  height: 8px;
  background: currentColor;
  animation: equalize 650ms ease-in-out infinite alternate;
}

.equalizer i:nth-child(2) {
  height: 15px;
  animation-delay: 150ms;
}

.equalizer i:nth-child(3) {
  height: 11px;
  animation-delay: 300ms;
}

.equalizer i:nth-child(4) {
  height: 17px;
  animation-delay: 100ms;
}

.music-panel-enter-active,
.music-panel-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.music-panel-enter-from,
.music-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes equalize {
  from {
    transform: scaleY(0.45);
  }

  to {
    transform: scaleY(1);
  }
}

@media (max-width: 640px) {
  .music-widget {
    right: 16px;
    bottom: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-toggle,
  .music-info,
  .music-panel-enter-active,
  .music-panel-leave-active {
    transition: none;
  }

  .equalizer i {
    animation: none;
  }
}
</style>
