<template>
  <DemoSection title="Player — play/pause, seek, volume, mute on useMediaControls + Slider" min="34rem">
    <DemoItem label="title + artist drive Media Session metadata too">
      <PrtAudioPlayer
        src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3"
        title="Sample track"
        artist="Audio-Sample-files"
        seed="7"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Compact — single slim row (the web-player bottom bar)" min="26rem">
    <DemoItem label="compact: play · wide seek · time · volume, one row, no title block">
      <PrtAudioPlayer
        src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3"
        title="Sample track"
        artist="Audio-Sample-files"
        compact
        seed="7"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Playlist — prev/next emit; the consumer owns the track list" min="30rem">
    <DemoItem label="skip wires prev/next + OS media keys; the parent swaps src (2 mp3s)">
      <PrtAudioPlayer
        :src="playlist.src"
        :title="playlist.title"
        artist="Audio-Sample-files"
        compact
        skip
        :has-prev="playlist.hasPrev"
        :has-next="playlist.hasNext"
        seed="7"
        @prev="playlist.prev"
        @next="playlist.next"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Waveform — SoundCloud peaks that double as the seek bar" min="34rem">
    <DemoItem label="decoded peaks (not a live spectrum); crossorigin keeps decode CORS-clean">
      <PrtAudioPlayer
        src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3"
        title="Sample track"
        artist="Audio-Sample-files"
        waveform
        crossorigin="anonymous"
        seed="9"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom controls — the #controls slot (playing, toggle)" min="34rem">
    <DemoItem label="replace the transport row, keep the engine">
      <PrtAudioPlayer src="https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3" title="Sample track">
        <template #controls="{ playing, toggle }">
          <PrtBtn :seed="playing ? 8 : 7" @click="toggle">
            {{ playing ? 'Pause' : 'Play' }} sample
          </PrtBtn>
        </template>
      </PrtAudioPlayer>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const playlist = (() => {
  const tracks = [
    { src: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3', title: 'Sample track' },
    { src: 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample2.mp3', title: 'Second sample' },
  ]
  const i = ref(0)
  return {
    get src() { return tracks[i.value].src },
    get title() { return tracks[i.value].title },
    get hasPrev() { return i.value > 0 },
    get hasNext() { return i.value < tracks.length - 1 },
    prev() { if (i.value > 0) i.value-- },
    next() { if (i.value < tracks.length - 1) i.value++ },
  }
})()
</script>
