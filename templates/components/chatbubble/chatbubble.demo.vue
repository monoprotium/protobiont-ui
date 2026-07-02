<template>
  <DemoSection title="A thread — grouped runs show the tail only on the last bubble" min="26rem">
    <DemoItem label="received + sent, grouping, meta on the last">
      <div class="flex flex-col">
        <PrtChatBubble side="received" grouped>Did the master bounce land?</PrtChatBubble>
        <PrtChatBubble side="received">It's on the shared drive now.</PrtChatBubble>
        <PrtChatBubble side="sent" seed="7" grouped>Pulling it.</PrtChatBubble>
        <PrtChatBubble side="sent" seed="7">
          Levels look great — shipping it.
          <template #meta>9:42 · delivered</template>
        </PrtChatBubble>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sides & seeds — sent takes the seed, received stays surface" min="24rem">
    <DemoItem label="received (surface)">
      <PrtChatBubble side="received">Quick one — are we still on for the mix review?</PrtChatBubble>
    </DemoItem>
    <DemoItem label='sent, seed="7" (identity emerald)'>
      <PrtChatBubble side="sent" seed="7">Yep, 3pm works.</PrtChatBubble>
    </DemoItem>
    <DemoItem label='sent, seed="9" (amber)'>
      <PrtChatBubble side="sent" seed="9">Booked the room.</PrtChatBubble>
    </DemoItem>
    <DemoItem label=':tail="false" — opt out of the tail'>
      <PrtChatBubble side="sent" seed="7" :tail="false">No tail on this one.</PrtChatBubble>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

</script>
