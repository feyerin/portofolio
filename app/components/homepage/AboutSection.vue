
<script setup lang="ts">
import AppContainer from "~/components/layout/AppContainer.vue";

const interests = [
  {
    title: "Little details",
    description:
      "I like noticing the small things that make an experience feel thoughtful — spacing, motion, colors, and the way everything comes together.",
    icon: "✧",
  },
  {
    title: "Imaginary worlds",
    description:
      "I’m drawn to worlds with their own atmosphere, stories, and details. That sense of discovery is something I like bringing into the things I create.",
    icon: "♜",
  },
  {
    title: "Learning by making",
    description:
      "I enjoy following my curiosity, trying an idea out, and learning along the way instead of waiting until I know everything.",
    icon: "✦",
  },
];

const dailyActivities = [
  {
    number: "01",
    title: "Explore a new idea",
    subtitle: "FOLLOW THE CURIOSITY",
    description:
      "I usually start by looking around, collecting inspiration, or wondering how something works. One small question can turn into a new thing to learn.",
    icon: "✧",
  },
  {
    number: "02",
    title: "Make it feel right",
    subtitle: "TINKER AND CREATE",
    description:
      "When I build something, I like experimenting with the details, trying different approaches, and shaping the pieces until they feel right together.",
    icon: "⚒",
  },
  {
    number: "03",
    title: "Take a step back",
    subtitle: "PAUSE, NOTICE, REPEAT",
    description:
      "Not every moment has to be productive. I make room to pause, reset, and return with a clearer head and fresh perspective.",
    icon: "♜",
  },
];

const mapLocations = [
  { name: "THE SHIRE", x: 20, y: 38, type: "forest" },
  { name: "CODEHAVEN", x: 44, y: 25, type: "castle" },
  { name: "THE IRON PEAKS", x: 65, y: 43, type: "mountain" },
  { name: "THE LOST ISLES", x: 79, y: 67, type: "island" },
];
</script>

<template>
  <section
    id="about"
    class="about-section relative isolate scroll-mt-24 overflow-hidden bg-[#f4eddf] py-12 text-[#493927] sm:py-24 lg:py-20"
    aria-labelledby="about-title"
  >
    <!-- Parchment and pixel-grid background -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 opacity-40"
      style="
        background-image:
          radial-gradient(ellipse at 15% 25%, #d8c79f 0%, transparent 45%),
          radial-gradient(ellipse at 90% 70%, #e3d2b2 0%, transparent 42%);
      "
    />

    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 opacity-[0.13]"
      style="
        background-image:
          linear-gradient(#94713a 1px, transparent 1px),
          linear-gradient(90deg, #94713a 1px, transparent 1px);
        background-size: 24px 24px;
      "
    />

    <!-- Decorative medieval icons -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span class="about-decoration about-sword">⚔</span>
      <span class="about-decoration about-rune">✧</span>
      <span class="about-decoration about-shield">♜</span>
      <span class="about-decoration about-sparkle">✦</span>
      <span class="about-decoration about-potion">♜</span>
    </div>

    <AppContainer>
      <div class="relative px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Section heading -->
        <header class="mb-14 flex flex-col justify-between gap-6 border-b border-[#a1844e]/40 pb-8 sm:mb-20 sm:flex-row sm:items-end">
          <div>
            <p class="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.16em] text-[#827765]">
              <span class="text-[#783f46]">III</span>
              <span aria-hidden="true">✦</span>
              CHARACTER PROFILE
            </p>

            <h2
              id="about-title"
              class="font-[Cormorant_Garamond,Georgia,serif] text-6xl font-medium leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
            >
              The adventurer
              <span class="block pl-8 text-[#783f46] sm:pl-16">
                behind the code<span class="text-[#94713a]">.</span>
              </span>
            </h2>
          </div>

          <div class="max-w-57.5">
            <p class="mb-2 font-mono text-[9px] tracking-[0.15em] text-[#94713a]">
              GUILD RECORD / 001
            </p>
            <p class="text-sm font-display leading-7 text-[#716552]">
              Every great digital world begins with a curious mind and a willingness to explore.
            </p>
          </div>
        </header>

        <!-- Profile + world map -->
        <div class="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <!-- Character portrait -->
          <div class="lg:col-span-4">
            <div class="profile-frame relative mx-auto max-w-97.5 lg:mx-0">
              <!-- Ornamental frame -->
              <div class="relative border-2 border-[#493927] bg-[#fbf8f1] p-2 shadow-[6px_6px_0_#c6b28b]">
                <div class="relative border border-[#a1844e]/70 p-3">
                  <div class="mb-3 flex items-center justify-between border-b border-[#a1844e]/40 pb-3">
                    <span class="font-mono text-[9px] tracking-[0.13em] text-[#783f46]">
                      A LITTLE ABOUT ME
                    </span>
                    <span class="text-lg text-[#94713a]" aria-hidden="true">⚜</span>
                  </div>

                  <!--
                    Put your portrait at:
                    public/images/profile.jpg

                    Then this image will appear automatically.
                  -->
                  <div class="portrait-stage relative aspect-4/5 overflow-hidden border border-[#a1844e]/45 bg-[#e8dcc5]">
                    <img
                      src="/images/profile/profile.JPG"
                      alt="A personal portrait"
                      class="absolute inset-0 h-full w-full object-cover object-center"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />

                    <!-- Fallback shown until you add your photo -->
                    <div class="portrait-placeholder absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                      <div class="portrait-silhouette relative flex h-32 w-28 items-end justify-center">
                        <div class="absolute top-2 h-14 w-14 border-4 border-[#493927] bg-[#c5a77b]" />
                        <div class="absolute bottom-0 h-16 w-24 border-4 border-[#493927] bg-[#783f46]" />
                        <div class="absolute bottom-9 h-6 w-16 bg-[#d8bd91]" />
                      </div>
                      <span class="font-mono text-[9px] tracking-[0.14em] text-[#716552]">
                        YOUR PORTRAIT GOES HERE
                      </span>
                      <span class="text-xs text-[#94713a]">
                        Add /public/images/profile.jpg
                      </span>
                    </div>

                    <!-- Pixel corner decorations -->
                    <span class="portrait-corner left-0 top-0" />
                    <span class="portrait-corner right-0 top-0" />
                    <span class="portrait-corner bottom-0 left-0" />
                    <span class="portrait-corner bottom-0 right-0" />

                    <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#30271f]/90 via-[#30271f]/40 to-transparent px-4 pb-5 pt-16">
                      <p class="font-mono text-[8px] tracking-[0.16em] text-[#e6cf9b]">
                        CURRENTLY EXPLORING
                      </p>
                      <p class="mt-1 font-[Cormorant_Garamond,Georgia,serif] text-3xl text-[#fff8e9]">
                        Curious by nature
                      </p>
                    </div>
                  </div>

                  <div class="mt-3 flex items-center justify-between gap-3 font-mono text-[8px] tracking-widest text-[#827765]">
                    <span>HOME: MY LITTLE CORNER</span>
                    <span class="text-[#783f46]">STILL GROWING</span>
                  </div>
                </div>

                <span class="portrait-outer-corner left-0 top-0" />
                <span class="portrait-outer-corner right-0 top-0" />
                <span class="portrait-outer-corner bottom-0 left-0" />
                <span class="portrait-outer-corner bottom-0 right-0" />
              </div>

              <div class="mt-5 flex items-center justify-between gap-3 border-b border-[#a1844e]/40 pb-4">
                <div>
                  <p class="font-mono text-[9px] tracking-[0.13em] text-[#94713a]">
                    A SMALL REMINDER
                  </p>
                  <p class="mt-1 font-[Cormorant_Garamond,Georgia,serif] text-2xl text-[#493927]">
                    Stay curious
                  </p>
                </div>
                <span class="grid size-12 place-items-center border border-[#a1844e]/60 bg-[#eee3cf] text-xl text-[#783f46]">
                  ✧
                </span>
              </div>
            </div>
          </div>

          <!-- World map + introduction -->
          <div class="min-w-0 lg:col-span-8">
            <div class="mb-7">
              <p class="mb-3 font-mono text-[9px] tracking-[0.15em] text-[#94713a]">
                A LITTLE MAP OF MY MIND
              </p>
              <h3 class="font-[Cormorant_Garamond,Georgia,serif] text-4xl leading-tight tracking-tight sm:text-5xl">
                A world of
                <span class="text-[#783f46}">little curiosities.</span>
              </h3>
            </div>

            <!-- Pixel art world map -->
            <div class="world-map-frame relative overflow-hidden border-2 border-[#493927] bg-[#d9d0ae] p-2 shadow-[5px_5px_0_#c6b28b]">
              <div class="relative overflow-hidden border border-[#94713a]/60">
                <!-- Map header -->
                <div class="relative z-20 flex items-center justify-between gap-3 border-b border-[#94713a]/40 bg-[#eee3cf] px-3 py-3 sm:px-5">
                  <span class="font-mono text-[8px] tracking-widest text-[#655641] sm:text-[9px]">
                    A MAP OF IDEAS & CURIOSITY
                  </span>
                  <span class="font-mono text-[8px] tracking-widest text-[#783f46] sm:text-[9px]">
                    ALWAYS IN PROGRESS
                  </span>
                </div>

                <div class="world-map-canvas relative">
                  <!-- Ocean grid -->
                  <div class="absolute inset-0 map-ocean-grid" />

                  <!-- Decorative ocean markings -->
                  <div aria-hidden="true" class="map-coordinate map-coordinate-one">N 45°</div>
                  <div aria-hidden="true" class="map-coordinate map-coordinate-two">E 120°</div>
                  <div aria-hidden="true" class="map-coordinate map-coordinate-three">SEA OF IDEAS</div>

                  <svg
                    viewBox="0 0 760 460"
                    class="relative z-10 block h-auto w-full"
                    role="img"
                    aria-label="Pixel art fantasy world map with forests, mountains, castles, islands, and travel routes"
                    shape-rendering="crispEdges"
                  >
                    <defs>
                      <pattern id="mapPixels" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M8 0H0V8" fill="none" stroke="#f3ead8" stroke-opacity=".35" stroke-width="1" />
                      </pattern>
                    </defs>

                    <!-- Main continent silhouette -->
                    <path
                      d="M96 92H144V76H192V84H232V68H280V84H312V100H352V84H392V100H424V124H448V148H472V172H456V196H432V220H408V244H384V268H352V284H328V308H296V324H264V308H240V292H208V276H176V252H152V228H128V196H104V164H88V124H96Z"
                      fill="#6e8158"
                      stroke="#493927"
                      stroke-width="4"
                    />

                    <!-- Northern highlands -->
                    <path
                      d="M192 84H232V68H280V84H312V100H296V124H272V132H248V116H216V132H192V116H176V100H192Z"
                      fill="#a2a27b"
                    />

                    <!-- Western forest -->
                    <path
                      d="M112 164H136V148H160V164H176V188H192V212H176V236H152V220H136V196H112Z"
                      fill="#45654a"
                    />

                    <!-- Central plains -->
                    <path
                      d="M200 148H224V132H256V148H280V164H304V188H288V212H272V228H240V212H216V196H200V180H184V164H200Z"
                      fill="#b9ae79"
                    />

                    <!-- Eastern mountains -->
                    <path
                      d="M320 116H344V100H360V116H376V132H392V148H408V164H392V180H376V196H352V180H336V164H320V148H304V132H320Z"
                      fill="#7f7763"
                    />
                    <path d="M344 116H352V132H360V148H344V140H336V132H344Z" fill="#eee3cf" />
                    <path d="M376 140H384V156H392V164H376V156H368V148H376Z" fill="#eee3cf" />
                    <path d="M320 148H328V164H336V172H320V164H312V156H320Z" fill="#eee3cf" />

                    <!-- Southern forest -->
                    <path
                      d="M208 228H232V212H256V228H272V244H288V260H272V276H248V268H224V252H208V244H192V236H208Z"
                      fill="#45654a"
                    />

                    <!-- Eastern plains -->
                    <path
                      d="M288 196H312V180H336V196H352V212H368V228H352V244H328V260H304V244H288V228H272V212H288Z"
                      fill="#b9ae79"
                    />

                    <!-- River -->
                    <path
                      d="M264 124H272V148H280V164H272V188H264V204H248V220H240V236H224"
                      fill="none"
                      stroke="#648c91"
                      stroke-width="8"
                    />
                    <path
                      d="M264 124H272V148H280V164H272V188H264V204H248V220H240V236H224"
                      fill="none"
                      stroke="#b6d0c5"
                      stroke-width="3"
                    />

                    <!-- Pixel forests -->
                    <g fill="#304b38" stroke="#493927" stroke-width="2">
                      <path d="M128 156H144V172H152V188H136V180H128Z" />
                      <path d="M152 180H168V196H176V212H160V204H152Z" />
                      <path d="M128 204H144V220H152V236H136V228H128Z" />
                      <path d="M216 236H232V252H240V268H224V260H216Z" />
                      <path d="M248 244H264V260H272V276H256V268H248Z" />
                      <path d="M288 212H304V228H312V244H296V236H288Z" />
                    </g>

                    <!-- Trees -->
                    <g fill="#45654a" stroke="#493927" stroke-width="2">
                      <path d="M120 148H136V156H144V164H136V172H120V164H112V156H120Z" />
                      <path d="M152 172H168V180H176V188H168V196H152V188H144V180H152Z" />
                      <path d="M208 244H224V252H232V260H224V268H208V260H200V252H208Z" />
                      <path d="M264 252H280V260H288V268H280V276H264V268H256V260H264Z" />
                    </g>

                    <!-- Castle town -->
                    <g stroke="#493927" stroke-width="3" stroke-linejoin="miter">
                      <path d="M232 148H248V132H256V148H272V164H264V180H240V164H232Z" fill="#eee3cf" />
                      <path d="M224 140H232V132H240V140H248V148H224Z" fill="#783f46" />
                      <path d="M248 132H256V124H264V132H272V140H248Z" fill="#783f46" />
                      <path d="M244 156H252V164H244Z" fill="#94713a" />
                      <path d="M252 172H260V180H252Z" fill="#493927" />
                    </g>

                    <!-- Pixel roads -->
                    <path
                      d="M240 168H248V176H256V184H264V192H272V200H280V208H288V216H296V224H304"
                      fill="none"
                      stroke="#493927"
                      stroke-width="4"
                      stroke-dasharray="4 8"
                      class="map-road"
                    />

                    <!-- Northern watchtower -->
                    <g stroke="#493927" stroke-width="3">
                      <path d="M192 100H208V116H216V132H184V116H192Z" fill="#eee3cf" />
                      <path d="M184 100H192V92H200V100H208V108H184Z" fill="#783f46" />
                      <path d="M196 116H204V124H196Z" fill="#94713a" />
                    </g>

                    <!-- Eastern mountain outpost -->
                    <g stroke="#493927" stroke-width="3">
                      <path d="M344 180H360V196H368V212H336V196H344Z" fill="#eee3cf" />
                      <path d="M336 180H344V172H352V180H360V188H336Z" fill="#783f46" />
                      <path d="M348 196H356V204H348Z" fill="#94713a" />
                    </g>

                    <!-- Coastline islands -->
                    <g stroke="#493927" stroke-width="3">
                      <path d="M488 276H512V284H520V300H504V308H480V300H472V284H488Z" fill="#8c9a68" />
                      <path d="M544 324H560V332H568V348H552V356H536V348H528V332H544Z" fill="#8c9a68" />
                      <path d="M448 340H464V348H472V356H456V364H440V356H432V348H448Z" fill="#8c9a68" />
                      <path d="M592 248H608V256H616V264H600V272H584V264H576V256H592Z" fill="#8c9a68" />
                    </g>

                    <!-- Small desert region -->
                    <path
                      d="M304 252H320V244H336V252H352V268H344V284H328V292H312V276H304Z"
                      fill="#c9a96d"
                      stroke="#493927"
                      stroke-width="3"
                    />
                    <path d="M312 260H320V268H312Z M328 276H336V284H328Z" fill="#94713a" />

                    <!-- Compass rose -->
                    <g transform="translate(660 78)" stroke="#493927" stroke-width="3" shape-rendering="crispEdges">
                      <path d="M0 -32L8 -8L0 0L-8 -8Z" fill="#783f46" />
                      <path d="M0 32L8 8L0 0L-8 8Z" fill="#94713a" />
                      <path d="M-32 0L-8 -8L0 0L-8 8Z" fill="#eee3cf" />
                      <path d="M32 0L8 -8L0 0L8 8Z" fill="#eee3cf" />
                      <rect x="-4" y="-4" width="8" height="8" fill="#493927" />
                    </g>
                    <text x="660" y="34" text-anchor="middle" font-size="13" fill="#493927" font-family="monospace">N</text>
                    <text x="660" y="128" text-anchor="middle" font-size="13" fill="#493927" font-family="monospace">S</text>

                    <!-- Route line -->
                    <path
                      d="M152 188L240 160L352 188L496 292L552 340"
                      fill="none"
                      stroke="#783f46"
                      stroke-width="3"
                      stroke-dasharray="5 7"
                      class="map-route"
                    />

                    <!-- Journey markers -->
                    <g class="map-marker marker-one">
                      <rect x="144" y="180" width="16" height="16" fill="#f3dfaa" stroke="#493927" stroke-width="3" />
                      <rect x="148" y="184" width="8" height="8" fill="#783f46" />
                    </g>
                    <g class="map-marker marker-two">
                      <rect x="232" y="152" width="16" height="16" fill="#f3dfaa" stroke="#493927" stroke-width="3" />
                      <rect x="236" y="156" width="8" height="8" fill="#783f46" />
                    </g>
                    <g class="map-marker marker-three">
                      <rect x="344" y="180" width="16" height="16" fill="#f3dfaa" stroke="#493927" stroke-width="3" />
                      <rect x="348" y="184" width="8" height="8" fill="#783f46" />
                    </g>
                    <g class="map-marker marker-four">
                      <rect x="488" y="284" width="16" height="16" fill="#f3dfaa" stroke="#493927" stroke-width="3" />
                      <rect x="492" y="288" width="8" height="8" fill="#783f46" />
                    </g>

                    <!-- Map legend -->
                    <g transform="translate(32 370)">
                      <rect width="240" height="52" fill="#eee3cf" fill-opacity=".94" stroke="#493927" stroke-width="2" />
                      <rect x="12" y="13" width="10" height="10" fill="#783f46" />
                      <text x="29" y="22" font-size="10" fill="#493927" font-family="monospace">QUEST LOCATION</text>
                      <path d="M12 37H22" stroke="#783f46" stroke-width="3" stroke-dasharray="3 2" />
                      <text x="29" y="41" font-size="10" fill="#493927" font-family="monospace">PATH OF DISCOVERY</text>
                    </g>

                    <!-- Map title stamp -->
                    <g transform="translate(536 370)">
                      <rect width="180" height="52" fill="#eee3cf" fill-opacity=".94" stroke="#493927" stroke-width="2" />
                      <text x="90" y="21" text-anchor="middle" font-size="10" fill="#783f46" font-family="monospace">THE DIGITAL REALM</text>
                      <text x="90" y="38" text-anchor="middle" font-size="9" fill="#493927" font-family="monospace">EXPLORE / CREATE / REFINE</text>
                    </g>

                    <!-- Pixel overlay -->
                    <rect width="760" height="460" fill="url(#mapPixels)" pointer-events="none" />
                  </svg>

                  <!-- Labels positioned over the map -->
                  <div class="map-label map-label-shire">
                    <span class="map-label-dot" />
                    <span>THE SHIRE</span>
                  </div>
                  <div class="map-label map-label-codehaven">
                    <span class="map-label-dot" />
                    <span>CODEHAVEN</span>
                  </div>
                  <div class="map-label map-label-peaks">
                    <span class="map-label-dot" />
                    <span>IRON PEAKS</span>
                  </div>

                  <!-- Animated pixel particles -->
                  <span class="map-spark map-spark-one">✦</span>
                  <span class="map-spark map-spark-two">✧</span>
                  <span class="map-spark map-spark-three">✦</span>
                </div>

                <!-- Map footer -->
                <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#94713a]/40 bg-[#eee3cf] px-3 py-3 sm:px-5">
                  <span class="font-mono text-[8px] tracking-widest text-[#716552]">
                    A FEW PLACES IN MY IMAGINATION
                  </span>
                  <span class="font-mono text-[8px] tracking-widest text-[#783f46]">
                    THERE IS ALWAYS MORE TO DISCOVER...
                  </span>
                </div>
              </div>
            </div>

            <!-- Personal narrative -->
            <div class="mt-9 space-y-5">
              <p class="text-lg font-display font-bold leading-8 text-[#716552] sm:text-lg">
                I’m someone who enjoys being curious about the world around me. I like
                noticing little details, getting lost in an idea, and finding inspiration
                in things that might seem ordinary at first.
              </p>
              <p class="text-lg font-display font-bold leading-8 text-[#716552] sm:text-lg">
                Frontend is one way I get to turn that curiosity into something tangible.
                But outside the screen, I’m still just a person figuring things out,
                collecting small interests, and enjoying the process as much as the result.
              </p>
            </div>

            <!-- Things I like -->
            <div class="mt-9 border-y border-[#a1844e]/50 py-6 sm:py-8">
              <div class="mb-5 flex items-center justify-between gap-4">
                <p class="font-mono text-[9px] tracking-[0.15em] text-[#94713a]">
                  THINGS I LIKE
                </p>
                <span class="font-mono text-[9px] tracking-widest text-[#716552]">
                  LITTLE JOYS / 001—003
                </span>
              </div>
              <div class="grid gap-5 sm:grid-cols-3 sm:gap-4">
                <article v-for="interest in interests" :key="interest.title" class="interest-card">
                  <span class="mb-3 block text-xl text-[#94713a]" aria-hidden="true">
                    {{ interest.icon }}
                  </span>
                  <h4 class="mb-2 font-[Cormorant_Garamond,Georgia,serif] text-2xl text-[#493927]">
                    {{ interest.title }}
                  </h4>
                  <p class="text-sm leading-7 text-[#716552]">
                    {{ interest.description }}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>

        <!-- What I usually do -->
        <div class="mt-24 sm:mt-32 lg:mt-40">
          <header class="mb-8 flex flex-col justify-between gap-4 border-b border-[#a1844e]/50 pb-5 sm:flex-row sm:items-end">
            <div>
              <p class="mb-3 font-mono text-[9px] tracking-[0.15em] text-[#94713a]">
                A FEW NOTES FROM MY EVERYDAY
              </p>
              <h3 class="font-[Cormorant_Garamond,Georgia,serif] text-4xl tracking-tight sm:text-5xl">
                What I usually do
              </h3>
            </div>

            <span class="font-mono text-[9px] tracking-widest text-[#716552]">
              LITTLE ROUTINES / 001—003
            </span>
          </header>

          <div class="divide-y divide-[#a1844e]/40 border-b border-[#a1844e]/40">
            <article
              v-for="(principle, index) in dailyActivities"
              :key="principle.number"
              class="principle-row group grid gap-5 py-7 sm:grid-cols-12 sm:items-center sm:gap-6 sm:py-9"
              :style="{ '--principle-delay': `${index * 100}ms` }"
            >
              <div class="flex items-center gap-4 sm:col-span-1 sm:flex-col sm:items-start">
                <span class="font-mono text-[10px] text-[#783f46]">
                  {{ principle.number }}
                </span>
                <span class="text-lg text-[#94713a] sm:text-xl" aria-hidden="true">
                  {{ principle.icon }}
                </span>
              </div>

              <div class="sm:col-span-4">
                <p class="mb-2 font-mono text-[8px] tracking-[0.12em] text-[#94713a]">
                  {{ principle.subtitle }}
                </p>
                <h4 class="font-[Cormorant_Garamond,Georgia,serif] text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                  {{ principle.title }}
                </h4>
              </div>

              <p class="max-w-xl text-sm leading-7 text-[#716552] sm:col-span-6 sm:col-start-7 sm:text-base">
                {{ principle.description }}
              </p>
            </article>
          </div>
        </div>

        <!-- Closing note -->
        <div class="mt-16 flex flex-col items-center justify-center gap-3 text-center sm:mt-20">
          <div class="grid size-14 place-items-center border border-[#a1844e]/60 text-2xl text-[#94713a]">
            ⚜
          </div>
          <p class="font-mono text-[9px] tracking-[0.16em] text-[#94713a]">
            THAT’S A LITTLE BIT OF ME
          </p>
          <p class="font-[Cormorant_Garamond,Georgia,serif] text-xl italic text-[#716552]">
            Still curious. Still figuring things out.
          </p>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/about.css"></style>
