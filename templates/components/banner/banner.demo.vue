<template>
  <DemoSection title="Overlay — text over media + scrim" min="100%">
    <DemoItem label="seasonal sale hero — start-aligned, medium scrim">
      <PrtBanner variant="overlay" min-height="22rem">
        <template #eyebrow>Summer drop</template>
        <template #heading><h2>Up to 40% off the core collection</h2></template>
        <template #text>New arrivals added weekly. Free returns within 30 days,
        every order.</template>
        <template #actions>
          <PrtBtn seed="7">Shop the sale</PrtBtn>
          <PrtBtn variant="outline">Browse new in</PrtBtn>
        </template>
        <template #media>
          <PrtLazyImg fill src="https://picsum.photos/seed/prt-sale/1600/900" alt="" />
        </template>
      </PrtBanner>
    </DemoItem>
    <DemoItem label="center-aligned, strong scrim">
      <PrtBanner variant="overlay" content-align="center" overlay-strength="strong" min-height="22rem">
        <template #eyebrow>Now playing</template>
        <template #heading><h2>The studio sessions</h2></template>
        <template #text>A curated set, remastered. Listen in lossless.</template>
        <template #actions>
          <PrtBtn seed="7">Start listening</PrtBtn>
        </template>
        <template #media>
          <PrtLazyImg fill src="https://picsum.photos/seed/prt-studio/1600/900" alt="" />
        </template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Overlay strengths — none / light / medium / strong (the universal axis)" min="100%">
    <DemoItem label='overlay-strength="light" — thin veil, paired with an ALREADY-DARK image'>
      <PrtBanner variant="overlay" overlay-strength="light" min-height="14rem">
        <template #heading><h3>Light scrim</h3></template>
        <template #text>A thin veil is enough when the photo is already dark.</template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-night/1600/700" alt="" /></template>
      </PrtBanner>
    </DemoItem>
    <DemoItem label='overlay-strength="strong" — bright/busy image needs the heavy veil'>
      <PrtBanner variant="overlay" overlay-strength="strong" min-height="14rem">
        <template #heading><h3>Strong scrim</h3></template>
        <template #text>Bright or busy imagery fights white text — go strong (or use
        scrim-tone="light" below).</template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-coast/1600/700" alt="" /></template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>

  <DemoSection title='Dark imagery → light text (scrim-tone="dark", the default)' min="100%">
    <DemoItem label="dark/busy photo — default dark veil + light ink">
      <PrtBanner variant="overlay" overlay-strength="medium" min-height="16rem">
        <template #eyebrow>Now playing</template>
        <template #heading><h3>The studio sessions</h3></template>
        <template #text>White text over a dark veil — the default polarity.</template>
        <template #actions><PrtBtn seed="7">Start listening</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-night/1600/800" alt="" /></template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>

  <DemoSection title='Bright imagery → dark text (scrim-tone="light")' min="100%">
    <DemoItem label="same bright photo, DEFAULT dark tone — light text can wash out">
      <PrtBanner variant="overlay" overlay-strength="medium" min-height="16rem">
        <template #eyebrow>Summer drop</template>
        <template #heading><h3>White text, bright photo</h3></template>
        <template #text>On high-key imagery the light ink fights the background.</template>
        <template #actions><PrtBtn seed="7">Shop the sale</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-coast/1600/800" alt="" /></template>
      </PrtBanner>
    </DemoItem>
    <DemoItem label='scrim-tone="light" — light veil + dark ink reads cleanly'>
      <PrtBanner variant="overlay" scrim-tone="light" overlay-strength="medium" min-height="16rem">
        <template #eyebrow>Summer drop</template>
        <template #heading><h3>Dark text, bright photo</h3></template>
        <template #text>A light veil + dark ink — the polarity for bright imagery.</template>
        <template #actions><PrtBtn seed="7">Shop the sale</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-coast/1600/800" alt="" /></template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Split — solid-bg side caption (the reliable, image-independent option)" min="100%">
    <DemoItem label="media end (default) — text on its own surface panel, never over the photo">
      <PrtBanner variant="split" min-height="18rem">
        <template #eyebrow>Feature</template>
        <template #heading><h2>Design tokens, one source of truth</h2></template>
        <template #text>Swap a theme file and the whole kit re-voices — surfaces,
        ink, the ten-seed rack, all derived.</template>
        <template #actions><PrtBtn seed="7">Read the docs</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-tokens/1200/900" alt="Abstract studio still life" /></template>
      </PrtBanner>
    </DemoItem>
    <DemoItem label='media start + custom column ratio (style="--prt-banner-ratio: 1.4fr")'>
      <PrtBanner variant="split" media-align="start" min-height="18rem" style="--prt-banner-ratio: 1.4fr">
        <template #eyebrow>Case study</template>
        <template #heading><h2>From prototype to storefront in a weekend</h2></template>
        <template #text>The starters tier ships whole journeys — checkout, splash —
        as copyable source you own.</template>
        <template #actions>
          <PrtBtn seed="7">See starters</PrtBtn>
          <PrtBtn variant="ghost">Watch the demo</PrtBtn>
        </template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-build/1200/900" alt="Workspace desk with laptop" /></template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Side caption — narrow solid panel beside the image (left / right)" min="100%">
    <DemoItem label='caption left — narrow panel (style="--prt-banner-ratio: 0.6fr")'>
      <PrtBanner variant="split" min-height="16rem" style="--prt-banner-ratio: 0.6fr">
        <template #eyebrow>Special offer</template>
        <template #heading><h2>Up to 20% off</h2></template>
        <template #text>The whole core collection, this week only.</template>
        <template #actions><PrtBtn seed="7">Shop now</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-desk/1200/900" alt="Workspace flat-lay" /></template>
      </PrtBanner>
    </DemoItem>
    <DemoItem label='caption right — media-align="start", narrow panel'>
      <PrtBanner variant="split" media-align="start" min-height="16rem" style="--prt-banner-ratio: 0.6fr">
        <template #eyebrow>New collection</template>
        <template #heading><h2>Discover our latest arrivals</h2></template>
        <template #text>Restocked weekly, shipped in 48 hours.</template>
        <template #actions><PrtBtn seed="7">Explore</PrtBtn></template>
        <template #media><PrtLazyImg fill src="https://picsum.photos/seed/prt-keys/1200/900" alt="Keyboard and tablet" /></template>
      </PrtBanner>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
