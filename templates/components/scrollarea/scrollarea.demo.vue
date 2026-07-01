<template>
  <DemoSection title="Drop-in overlay scrollbar (native scroll, custom thumb)" min="21rem">
    <DemoItem label="default — vertical, always visible">
      <PrtScrollArea class="h-56 rounded-surface border border-edge bg-surface-1">
        <div class="p-4 flex flex-col gap-3 text-sm text-ink-muted leading-relaxed">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius turpis et commodo pharetra est.</p>
          <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula condimentum.</p>
          <p>Donec lobortis risus a elit. Etiam tempor ligula eu tempor congue, eros est euismod turpis.</p>
          <p>Vivamus sit amet est in lorem porttitor faucibus. Mauris a nibh in arcu placerat dignissim.</p>
        </div>
      </PrtScrollArea>
    </DemoItem>
    <DemoItem label='size="lg" — thicker bar'>
      <PrtScrollArea size="lg" class="h-56 rounded-surface border border-edge bg-surface-1">
        <div class="p-4 flex flex-col gap-3 text-sm text-ink-muted leading-relaxed">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius turpis et commodo pharetra est.</p>
          <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula condimentum.</p>
          <p>Donec lobortis risus a elit. Etiam tempor ligula eu tempor congue, eros est euismod turpis.</p>
          <p>Vivamus sit amet est in lorem porttitor faucibus. Mauris a nibh in arcu placerat dignissim.</p>
        </div>
      </PrtScrollArea>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Auto-hide & both axes" min="21rem">
    <DemoItem label='auto-hide="scroll" — fades in only while scrolling'>
      <PrtScrollArea auto-hide="scroll" class="h-56 rounded-surface border border-edge bg-surface-1">
        <div class="p-4 flex flex-col gap-3 text-sm text-ink-muted leading-relaxed">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius turpis et commodo pharetra est.</p>
          <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula condimentum.</p>
          <p>Donec lobortis risus a elit. Etiam tempor ligula eu tempor congue, eros est euismod turpis.</p>
          <p>Vivamus sit amet est in lorem porttitor faucibus. Mauris a nibh in arcu placerat dignissim.</p>
        </div>
      </PrtScrollArea>
    </DemoItem>
    <DemoItem label='orientation="both" — vertical + horizontal'>
      <PrtScrollArea orientation="both" class="h-56 rounded-surface border border-edge bg-surface-1">
        <div class="p-4 w-[44rem] flex flex-col gap-3 text-sm text-ink-muted leading-relaxed">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Curabitur pretium tincidunt lacus, nulla gravida orci a odio. Nullam varius turpis et commodo pharetra est.</p>
          <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula condimentum.</p>
          <p>Donec lobortis risus a elit. Etiam tempor ligula eu tempor congue, eros est euismod turpis.</p>
          <p>Vivamus sit amet est in lorem porttitor faucibus. Mauris a nibh in arcu placerat dignissim.</p>
        </div>
      </PrtScrollArea>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
