<template>
  <DemoSection title="Record — meter, stop, review, then save (logs the real type + ext)" min="34rem">
    <DemoItem label="save proves the no-.mp3 rule: webm/ogg, derived from Blob.type">
      <div class="flex flex-col gap-2">
        <PrtAudioRecorder
          meter
          seed="7"
          @save="(blob, meta) => { value = meta.mimeType + '  →  .' + meta.extension }"
        />
        <span class="text-xs font-mono text-ink-faint">saved: {{ value || '— record, stop, then Save' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Compact — slim form for a composer / toolbar" min="26rem">
    <DemoItem label="compact: tight chrome, review collapses to a compact player">
      <PrtAudioRecorder compact meter seed="7" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Export + host actions — download + your own pipeline button (#actions)" min="34rem">
    <DemoItem label="downloadable adds Export; #actions hands the take to YOUR pipeline">
      <div class="flex flex-col gap-2">
        <PrtAudioRecorder downloadable seed="7">
          <template #actions="{ meta }">
            <PrtBtn variant="outline" size="sm" @click="value = 'sent ' + meta.duration.toFixed(1) + 's to transcription'">
              <template #prepend><span class="i-lucide-sparkles h-4 w-4" /></template>
              Transcribe
            </PrtBtn>
          </template>
        </PrtAudioRecorder>
        <span class="text-xs font-mono text-ink-faint">{{ value || '— record, stop, then Export or Transcribe' }}</span>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Capture constraints — flatter, more faithful input" min="34rem">
    <DemoItem label="constraints disables auto-gain / noise-suppression (default true)">
      <PrtAudioRecorder
        meter
        seed="7"
        :constraints="{ autoGainControl: false, noiseSuppression: false, echoCancellation: false }"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="maxDuration — auto-stops at the limit" min="34rem">
    <DemoItem label=':max-duration="10" — stops itself at ten seconds'>
      <PrtAudioRecorder :max-duration="10" meter seed="9" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Errors — reason codes (deny the mic to see permission-denied)" min="30rem">
    <DemoItem label="the consumer renders the message from the reason code (D13)">
      <div class="flex flex-col gap-2">
        <PrtAudioRecorder
          :playback="false"
          @error="(reason) => { value = reason }"
        />
        <span class="text-xs font-mono text-danger">{{ value || '— no error yet' }}</span>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
</script>
