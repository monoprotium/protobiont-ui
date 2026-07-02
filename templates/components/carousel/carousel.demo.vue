<template>
  <DemoSection title="Image carousel — square slides (rounded edges look wrong mid-swipe)" min="34rem">
    <DemoItem label="drag, arrows, or dots — embla owns the motion">
      <PrtCarousel loop>
        <PrtLazyImg src="/geo-1.svg" alt="Pulse-8 desktop synthesizer" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-2.svg" alt="Route-X DanteBridge interface" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-3.svg" alt="Grid-16 drum machine" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-4.svg" alt="Drift analog delay pedal" aspect="16/9" rounded="none" />
      </PrtCarousel>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Multiple per view — slide width is a css hook; embla owns slidesToScroll" min="34rem">
    <DemoItem label="three across via --prt-carousel-slide, padding makes the gutters">
      <PrtCarousel :slides-to-scroll="1" style="--prt-carousel-slide: 33.333%">
        <div class="px-1.5"><PrtLazyImg src="/geo-1.svg" alt="Pulse-8 synth" aspect="1/1" rounded="none" /></div>
        <div class="px-1.5"><PrtLazyImg src="/geo-2.svg" alt="DanteBridge" aspect="1/1" rounded="none" /></div>
        <div class="px-1.5"><PrtLazyImg src="/geo-3.svg" alt="Drum machine" aspect="1/1" rounded="none" /></div>
        <div class="px-1.5"><PrtLazyImg src="/geo-4.svg" alt="Delay pedal" aspect="1/1" rounded="none" /></div>
        <div class="px-1.5"><PrtLazyImg src="/geo-1.svg" alt="Pocket sampler" aspect="1/1" rounded="none" /></div>
      </PrtCarousel>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Card carousel — slides are arbitrary content, not just images" min="34rem">
    <DemoItem label="embla carries cards, DAW racks, anything (slot content)">
      <PrtCarousel loop style="--prt-carousel-slide: 70%">
        <div class="px-2">
          <PrtCard>
            <template #header>Drift analog delay</template>
            <template #default>BBD-style delay pedal with modulated repeats and tap tempo.</template>
            <template #footer><span class="text-ink font-medium">$219</span></template>
          </PrtCard>
        </div>
        <div class="px-2">
          <PrtCard>
            <template #header>Grid-16 drum machine</template>
            <template #default>Sixteen velocity pads, per-step probability, swing and ratchets.</template>
            <template #footer><span class="text-ink font-medium">$429</span></template>
          </PrtCard>
        </div>
        <div class="px-2">
          <PrtCard>
            <template #header>Route-X DanteBridge</template>
            <template #default>64-channel Dante-to-USB bridge for studio rigs.</template>
            <template #footer><span class="text-ink font-medium">$799</span></template>
          </PrtCard>
        </div>
      </PrtCarousel>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Autoplay — pauses on hover/focus, suppressed under reduced motion" min="34rem">
    <DemoItem label="autoplay + 2.5s delay, looped">
      <PrtCarousel autoplay :autoplay-delay="2500" loop>
        <PrtLazyImg src="/geo-2.svg" alt="Route-X DanteBridge" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-3.svg" alt="Grid-16 drum machine" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-4.svg" alt="Drift analog delay pedal" aspect="16/9" rounded="none" />
      </PrtCarousel>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Dots — square house mark (default) vs circle (mindless prop)" min="26rem">
    <DemoItem label='dotShape="square" (default)'>
      <PrtCarousel seed="7">
        <PrtLazyImg src="/geo-1.svg" alt="Pulse-8 synth" aspect="4/3" rounded="none" />
        <PrtLazyImg src="/geo-3.svg" alt="Drum machine" aspect="4/3" rounded="none" />
      </PrtCarousel>
    </DemoItem>
    <DemoItem label='dotShape="circle"'>
      <PrtCarousel seed="7" dot-shape="circle">
        <PrtLazyImg src="/geo-2.svg" alt="DanteBridge" aspect="4/3" rounded="none" />
        <PrtLazyImg src="/geo-4.svg" alt="Delay pedal" aspect="4/3" rounded="none" />
      </PrtCarousel>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom arrows — the arrow-prev / arrow-next slots" min="34rem">
    <DemoItem label="override the controls, keep embla driving">
      <PrtCarousel :dots="false">
        <template #arrow-prev="{ scroll, disabled }">
          <PrtBtn variant="outline" size="sm" class="absolute left-2 top-1/2 -translate-y-1/2" :disabled="disabled" @click="scroll">Prev</PrtBtn>
        </template>
        <template #arrow-next="{ scroll, disabled }">
          <PrtBtn variant="outline" size="sm" class="absolute right-2 top-1/2 -translate-y-1/2" :disabled="disabled" @click="scroll">Next</PrtBtn>
        </template>
        <PrtLazyImg src="/geo-3.svg" alt="Grid-16 drum machine" aspect="16/9" rounded="none" />
        <PrtLazyImg src="/geo-1.svg" alt="Pulse-8 synth" aspect="16/9" rounded="none" />
      </PrtCarousel>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
