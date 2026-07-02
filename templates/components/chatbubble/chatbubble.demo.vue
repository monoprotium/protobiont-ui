<template>
  <DemoSection title="A thread — grouped runs show the tail only on the last bubble" min="26rem">
    <DemoItem label="received + sent, grouping, meta on the last">
      <div class="flex flex-col">
        <PrtChatBubble side="received" grouped>Did CI go green on the auth PR?</PrtChatBubble>
        <PrtChatBubble side="received">All checks passed just now.</PrtChatBubble>
        <PrtChatBubble side="sent" seed="7" grouped>Merging it.</PrtChatBubble>
        <PrtChatBubble side="sent" seed="7">
          Deployed to staging — looks clean.
          <template #meta>9:42 · delivered</template>
        </PrtChatBubble>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sides & seeds — sent takes the seed, received stays surface" min="24rem">
    <DemoItem label="received (surface)">
      <PrtChatBubble side="received">Quick one — can you review the migration PR?</PrtChatBubble>
    </DemoItem>
    <DemoItem label='sent, seed="7" (identity emerald)'>
      <PrtChatBubble side="sent" seed="7">On it — give me ten minutes.</PrtChatBubble>
    </DemoItem>
    <DemoItem label='sent, seed="9" (amber)'>
      <PrtChatBubble side="sent" seed="9">Approved and merged.</PrtChatBubble>
    </DemoItem>
    <DemoItem label=':tail="false" — opt out of the tail'>
      <PrtChatBubble side="sent" seed="7" :tail="false">Rolled back the hotfix.</PrtChatBubble>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
