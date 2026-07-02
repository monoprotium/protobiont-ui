<template>
  <DemoSection title="Date countdown — always live, to the next New Year" min="24rem">
    <DemoItem label="days / hrs / min / sec to the next Jan 1, seeded (recomputes each run)">
      <PrtCountdown :to="new Date(new Date().getFullYear() + 1, 0, 1)" seed="7" />
    </DemoItem>
    <DemoItem label="unseeded — quiet ink, same next-New-Year target">
      <PrtCountdown :to="new Date(new Date().getFullYear() + 1, 0, 1)" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Interactive timer — duration (seconds) + built-in controls" min="24rem">
    <DemoItem label="duration + controls: Start / Pause / Reset, default mm:ss clock">
      <PrtCountdown :duration="60" controls seed="7" />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Preset timers — slot methods start() / pause() / reset()" min="28rem">
    <DemoItem label="click a preset to set + start; clock / done / running come from the slot">
      <PrtCountdown :duration="300" seed="9">
        <template #default="{ clock, done, running, start, pause, reset }">
          <div class="flex flex-col items-center gap-3">
            <span class="text-3xl font-medium tabular-nums" :class="done ? 'text-ink-faint' : 'text-ink'">
              {{ done ? 'Done' : clock }}
            </span>
            <div class="flex items-center gap-2">
              <PrtBtn size="sm" seed="7" @click="start(60)">1 min</PrtBtn>
              <PrtBtn size="sm" seed="7" @click="start(180)">3 min</PrtBtn>
              <PrtBtn size="sm" seed="7" @click="start(300)">5 min</PrtBtn>
              <PrtBtn variant="ghost" size="sm" @click="running ? pause() : reset()">
                {{ running ? 'Pause' : 'Reset' }}
              </PrtBtn>
            </div>
          </div>
        </template>
      </PrtCountdown>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Custom layout — the default slot (e-commerce sale timer)" min="24rem">
    <DemoItem label="compact one-line render with the done flag">
      <div class="flex items-center gap-2 text-sm">
        <span class="text-ink-muted">Sale ends in</span>
        <PrtCountdown to="2026-12-25T00:00:00Z" seed="9">
          <template #default="{ days, hours, minutes, seconds, done }">
            <span class="font-mono tabular-nums font-medium text-ink">
              {{ done ? 'now' : days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's' }}
            </span>
          </template>
        </PrtCountdown>
      </div>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
