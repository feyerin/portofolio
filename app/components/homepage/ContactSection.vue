<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { renderContactArt } from "~/assets/pixelart/contactArt";

// Ganti dengan informasi profesional kamu.
const email = "post.aditia@gmail.com";
const linkedInUrl = "https://www.linkedin.com/in/aditia-nugraha-postman";
const githubUrl = "https://github.com/feyerin";

const year = new Date().getFullYear();
const isDev = import.meta.dev; // catatan untuk developer tidak tampil di production

const copied = ref(false);
const ravenReady = ref(false); // hover/fokus tombol -> gagak mengambil surat
const ravenFlying = ref(false); // klik tombol -> gagak terbang membawa pesan

const emailHref = computed(() =>
  email ? `mailto:${email}?subject=${encodeURIComponent("Let's work together")}` : "",
);

/** Tanpa email, tombol utama tetap berguna: mengarah ke LinkedIn. */
const primary = computed(() =>
  emailHref.value
    ? { href: emailHref.value, label: "ACCEPT THE QUEST", glyph: "mail", external: false }
    : { href: linkedInUrl, label: "ACCEPT ON LINKEDIN", glyph: "arrowOut", external: true },
);

const socialLinks = computed(() =>
  [
    { label: "LinkedIn", href: linkedInUrl },
    { label: "GitHub", href: githubUrl },
  ].filter((social) => social.href),
);

/* ───────── Interaksi ───────── */

const root = ref<HTMLElement | null>(null);
let reduced = false;
let io: IntersectionObserver | undefined;
let copyTimer = 0;
let flyTimer = 0;

function sendRaven() {
  if (reduced) return;
  ravenFlying.value = true;
  clearTimeout(flyTimer);
  flyTimer = window.setTimeout(() => (ravenFlying.value = false), 2800);
}

async function copyEmail() {
  if (!email || !import.meta.client || !navigator.clipboard) return;

  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => (copied.value = false), 2000);
  } catch {
    copied.value = false;
  }
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

/* ───────── Muncul saat di-scroll ───────── */

onMounted(() => {
  const el = root.value;
  if (!el) return;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderContactArt(el);

  const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.setAttribute("data-in", ""));
    return;
  }
  el.classList.add("is-armed"); // sebelum ini semua konten terlihat (aman untuk SSR / tanpa JS)
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-in", ""); // atribut data-*, bukan class: aman dari :class milik Vue
        io?.unobserve(e.target);
      }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((t) => io?.observe(t));
});

onBeforeUnmount(() => {
  io?.disconnect();
  clearTimeout(copyTimer);
  clearTimeout(flyTimer);
});
</script>

<template>
  <section
    id="contact"
    ref="root"
    class="contact-section relative isolate overflow-hidden py-24 text-ink sm:py-32 lg:py-40"
    aria-labelledby="contact-title"
  >
    <!-- Latar: perkamen + grid pixel (memudar di atas & bawah) -->
    <div aria-hidden="true" class="contact-parchment pointer-events-none absolute inset-0 -z-20 opacity-40" />
    <div aria-hidden="true" class="contact-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.13]" />

    <AppContainer>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <!-- Section heading -->
        <div data-reveal class="mb-10 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-label sm:text-[11px]">
            <span aria-hidden="true" class="h-[3px] w-7 bg-gold" />
            <span><span class="text-wine">05</span> / THE FINAL QUEST</span>
          </div>

          <span class="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-label-muted sm:flex">
            <span aria-hidden="true" class="status-dot" />
            QUEST STATUS: AVAILABLE
          </span>
        </div>

        <!-- Main parchment panel -->
        <div data-reveal class="quest-frame relative">
          <div class="quest-inner relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <!-- Lingkaran sihir pixel art -->
            <i class="rune rune-one" aria-hidden="true" />
            <i class="rune rune-two" aria-hidden="true" />

            <span class="corner corner-tl" aria-hidden="true" />
            <span class="corner corner-tr" aria-hidden="true" />
            <span class="corner corner-bl" aria-hidden="true" />
            <span class="corner corner-br" aria-hidden="true" />

            <div class="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-end lg:gap-10">
              <div class="max-w-3xl">
                <div class="mb-7 inline-flex items-center gap-3 border border-gold/45 bg-paper-raised px-3 py-2">
                  <span class="status-dot" aria-hidden="true" />
                  <span class="font-mono text-[10px] tracking-[0.16em] text-label">A NEW ADVENTURE AWAITS</span>
                </div>

                <h2
                  id="contact-title"
                  class="font-display text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-ink sm:text-6xl lg:text-8xl"
                >
                  Every great
                  <span class="block italic text-gold">quest starts</span>
                  with a message.
                </h2>

                <p class="mt-7 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
                  Have a project to build, an opportunity to share, or a difficult problem waiting to be solved?
                  Let's turn your next idea into something worth remembering.
                </p>

                <!-- Actions -->
                <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    :href="primary.href"
                    :target="primary.external ? '_blank' : undefined"
                    :rel="primary.external ? 'noopener noreferrer' : undefined"
                    class="pixel-button inline-flex min-h-12 items-center justify-center gap-4 px-6 py-3 font-mono text-[11px] tracking-[0.08em]"
                    @pointerenter="ravenReady = true"
                    @pointerleave="ravenReady = false"
                    @focus="ravenReady = true"
                    @blur="ravenReady = false"
                    @click="sendRaven"
                  >
                    <i class="glyph" :data-glyph="primary.glyph" aria-hidden="true" />
                    <span>{{ primary.label }}</span>
                    <i class="glyph" data-glyph="arrowOut" aria-hidden="true" />
                  </a>

                  <button
                    v-if="email"
                    type="button"
                    class="pixel-secondary inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.08em]"
                    @click="copyEmail"
                  >
                    <i class="glyph" :data-glyph="copied ? 'check' : 'copy'" aria-hidden="true" />
                    <span aria-live="polite">{{ copied ? "EMAIL COPIED" : "COPY EMAIL" }}</span>
                  </button>

                  <!-- Hanya tampil saat development -->
                  <p v-if="!email && isDev" class="m-0 max-w-xs text-xs leading-6 text-label-muted">
                    Dev note: set <code class="text-label">email</code> in ContactSection.vue to enable the email quest.
                  </p>
                </div>
              </div>

              <!-- Gagak pembawa pesan -->
              <div class="messenger mx-auto w-full max-w-[210px] lg:mx-0" aria-hidden="true">
                <p class="m-0 font-mono text-[10px] tracking-[0.14em] text-label">ROYAL MESSENGER</p>

                <div class="messenger__perch">
                  <i class="raven" :class="{ 'is-ready': ravenReady, 'is-flying': ravenFlying }" />
                </div>

                <div class="seal-divider"><span /><span>✦</span><span /></div>

                <p class="m-0 mt-3 font-mono text-[10px] tracking-[0.14em] text-label-muted">BUILT WITH CURIOSITY</p>
                <p class="m-0 mt-1.5 font-mono text-[10px] tracking-[0.14em] text-label">SEALED WITH CODE</p>
              </div>
            </div>

            <!-- Bottom information -->
            <div class="relative z-10 mt-12 border-t border-gold/40 pt-6 sm:mt-16">
              <div class="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p class="m-0 font-mono text-[10px] tracking-[0.18em] text-label">FIND THE ADVENTURER</p>

                  <ul class="m-0 mt-4 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
                    <li v-for="social in socialLinks" :key="social.label">
                      <a
                        :href="social.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-link inline-flex min-h-8 items-center gap-2 text-sm text-muted"
                      >
                        {{ social.label }}
                        <i class="glyph" data-glyph="arrowOut" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="font-mono text-[10px] leading-6 tracking-[0.1em] text-label-muted sm:text-right">
                  <p class="m-0">NO DRAGONS REQUIRED</p>
                  <p class="m-0">JUST GOOD IDEAS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- End of the journey -->
        <div
          data-reveal
          class="mt-8 flex flex-col items-center justify-between gap-3 font-mono text-[10px] tracking-[0.14em] text-label-muted sm:flex-row"
        >
          <span>END OF CHAPTER FIVE · © {{ year }} ADITIA NUGRAHA</span>

          <button type="button" class="back-to-top inline-flex min-h-10 items-center gap-2 py-2" @click="backToTop">
            RETURN TO THE KINGDOM
            <i class="glyph" data-glyph="arrowUp" aria-hidden="true" />
          </button>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/contactSection.css"></style>