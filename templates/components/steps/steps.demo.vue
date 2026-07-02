<template>
  <DemoSection title="Live — your wizard drives the index" min="26rem">
    <DemoItem label="v-model + two buttons; the consumer-owns-navigation story">
      <div class="flex flex-col gap-5">
        <PrtSteps
          v-model="count"
          :steps="[
            { label: 'Account', description: 'Email + password' },
            { label: 'Profile', description: 'Name and avatar' },
            { label: 'Review', description: 'Confirm everything' },
          ]"
        />
        <div class="flex gap-2">
          <PrtBtn variant="outline" size="sm" :disabled="count === 0" @click="count--">
            Previous
          </PrtBtn>
          <PrtBtn size="sm" :disabled="count === 2" @click="count++">
            {{ count === 2 ? 'Submit' : 'Next' }}
          </PrtBtn>
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Wizard — content composed in (the real pattern)" min="26rem">
    <DemoItem label="step content + nav are YOURS — v-if on the same index; a form layer gates Next in a real app">
      <div class="flex flex-col gap-5">
        <PrtSteps
          v-model="ex.wizard"
          :steps="[
            { label: 'Account', description: 'Email + password' },
            { label: 'Payment', description: 'Card details' },
            { label: 'Review', description: 'Confirm order' },
          ]"
        />
        <!-- shared min-h: panes differ in natural height — without it the
             nav row jumps every step -->
        <div v-if="ex.wizard === 0" class="min-h-36 border border-edge bg-surface-1 p-4">
          <PrtFormField
            v-model="value"
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            helper-text="Used for the order confirmation."
          />
        </div>
        <div v-else-if="ex.wizard === 1" class="min-h-36 border border-edge bg-surface-1 p-4">
          <PrtFormField
            v-model="choice"
            label="Card number"
            placeholder="4242 4242 4242 4242"
            helper-text="Test card — any future expiry works."
          />
        </div>
        <div v-else class="min-h-36 border border-edge bg-surface-1 p-4 text-sm">
          <div class="flex justify-between text-ink-muted"><span>Subtotal</span><span class="tabular-nums">$99.00</span></div>
          <div class="mt-1 flex justify-between text-ink-muted"><span>Shipping</span><span class="tabular-nums">$5.99</span></div>
          <div class="mt-2 border-t border-edge pt-2 flex justify-between text-ink"><span>Total</span><span class="tabular-nums">$104.99</span></div>
        </div>
        <div class="flex justify-between">
          <PrtBtn variant="outline" size="sm" :disabled="ex.wizard === 0" @click="ex.wizard--">
            Previous
          </PrtBtn>
          <PrtBtn size="sm" @click="ex.wizard === 2 ? (ex.wizard = 0) : ex.wizard++">
            {{ ex.wizard === 2 ? 'Submit' : 'Next' }}
          </PrtBtn>
        </div>
      </div>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Clickable" min="26rem">
    <DemoItem label="completed + the next step take clicks; forward jumps stay blocked">
      <PrtSteps
        v-model="page"
        clickable
        :steps="[
          { label: 'Cart' },
          { label: 'Shipping' },
          { label: 'Payment' },
          { label: 'Done' },
        ]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Without labels / layout" min="26rem">
    <DemoItem label=':show-labels="false" — dots only; labels become title + aria-label'>
      <PrtSteps
        v-model="ex.dots"
        :show-labels="false"
        :steps="[
          { label: 'Account' },
          { label: 'Payment' },
          { label: 'Review' },
        ]"
      />
    </DemoItem>
    <DemoItem label="short centered rail — plain layout classes, not a feature">
      <PrtSteps
        :model-value="1"
        class="max-w-sm mx-auto"
        :steps="[{ label: 'Source' }, { label: 'Mapping' }, { label: 'Import' }]"
      />
    </DemoItem>
    <DemoItem label='label-align="center" — ALL labels on their dots; outer ones use the side room'>
      <PrtSteps
        :model-value="1"
        label-align="center"
        class="max-w-sm mx-auto"
        :steps="[{ label: 'Source' }, { label: 'Mapping' }, { label: 'Import' }]"
      />
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes" min="26rem">
    <DemoItem label="sm">
      <PrtSteps
        :model-value="1"
        size="sm"
        :steps="[{ label: 'Source' }, { label: 'Mapping' }, { label: 'Import' }]"
      />
    </DemoItem>
    <DemoItem label="lg">
      <PrtSteps
        :model-value="1"
        size="lg"
        :steps="[{ label: 'Source' }, { label: 'Mapping' }, { label: 'Import' }]"
      />
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'

// bindings the slots reference (shared file scope; canonical decls in SourcePanel.sandboxDecls)
const value = ref('')
const choice = ref<string | number>('')
const count = ref(0)
const page = ref(1)
// each interactive steps demo gets its own index so they advance independently
const ex = ref<Record<string, number>>({ wizard: 0, dots: 0 })
</script>
