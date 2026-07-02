<template>
  <DemoSection title="The whole article — every element, drop-in" min="34rem">
    <DemoItem label="a real product-doc page rendered through PrtProse">
      <PrtProse>
        <h1>Release 2.4 — the rhythm pass</h1>
        <p>This release reworks how long-form content breathes. Every vertical gap is
        now a single <abbr title="root line height">rlh</abbr> step, so headings,
        lists and figures share one rhythm regardless of the reading size.</p>

        <h2>What changed</h2>
        <p>The body column drives the type scale through container queries, not the
        viewport — a doc rendered in a narrow sidebar reads at the same proportions
        as one rendered full-bleed. Press <kbd>Cmd</kbd> + <kbd>.</kbd> to toggle the
        measure overlay.</p>

        <ul>
          <li>Owl-flow rhythm: one rule, <mark>zero margin-collapse surprises</mark>.</li>
          <li>Two-ratio scale — restrained body steps, a wider jump for display.</li>
          <li>Token-mapped colour: links, code and quotes all ride the theme.</li>
        </ul>

        <h3>Migration order</h3>
        <ol>
          <li>Wrap rendered markdown in the prose component.</li>
          <li>Move any bespoke type overrides to the element hooks.</li>
          <li>Mark live UI islands with <code>class="not-prose"</code>.</li>
        </ol>

        <blockquote>Typography is the craft of endowing human language with a durable
        visual form. Good defaults make that craft invisible.</blockquote>

        <h4>The flow primitive</h4>
        <p>Under the hood it is the lobotomized owl, in <code>rlh</code> instead of
        <code>em</code>:</p>
        <pre><code>.prt-prose > * + * {
        margin-block-start: 1rlh;
      }</code></pre>

        <h4>Coverage by element</h4>
        <table>
          <thead>
            <tr><th>Element</th><th>Steps tuned</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td>Headings</td><td>4</td><td>balance + cap-trim</td></tr>
            <tr><td>Lists</td><td>2</td><td>nested rhythm</td></tr>
            <tr><td>Code</td><td>3</td><td>inline, block, kbd</td></tr>
          </tbody>
        </table>

        <figure>
          <img src="/geo-3.svg" alt="A geometric mark illustrating the modular scale" />
          <figcaption>Figure 1 — the modular scale, visualized.</figcaption>
        </figure>

        <hr />
        <p>See the <a href="#typography">typography doc</a> for the full token map.</p>
      </PrtProse>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Sizes — sm / base / lg (same rhythm, shifted base)" min="24rem">
    <DemoItem label='size="sm"'>
      <PrtProse size="sm">
        <h3>Compact reading</h3>
        <p>Denser docs sit at the small step — the rhythm scales with it, so the gaps
        stay proportional. Inline <code>code</code> and <a href="#">links</a> keep
        their treatments.</p>
      </PrtProse>
    </DemoItem>
    <DemoItem label='size="lg" — editorial'>
      <PrtProse size="lg">
        <h3>Editorial reading</h3>
        <p>A larger base step for marketing or long reads. <mark>Comfortable</mark>
        line length still caps at the measure.</p>
      </PrtProse>
    </DemoItem>
  </DemoSection>

  <DemoSection title="Measure — the line-length cap" min="28rem">
    <DemoItem label='measure="48ch" — tight column'>
      <PrtProse measure="48ch">
        <p>A short measure keeps lines easy to track for dense reference material.
        The fluid scale still measures against this narrower column, so proportions
        hold. This paragraph wraps sooner than the default 68ch.</p>
      </PrtProse>
    </DemoItem>
  </DemoSection>

  <DemoSection title="The not-prose island — live UI bleeds nothing" min="30rem">
    <DemoItem label="a live PrtCard dropped mid-article keeps its own type">
      <PrtProse>
        <h3>Embedding a component</h3>
        <p>Drop <code>class="not-prose"</code> on any UI island and the prose element
        rules — and inherited colour/font — stop at its edge:</p>
        <div class="not-prose">
          <PrtCard variant="raised">
            <template #header>Live card</template>
            This card renders with its own type stance, untouched by the surrounding
            prose rhythm.
            <template #footer>
              <PrtBtn size="sm" seed="7">Action</PrtBtn>
            </template>
          </PrtCard>
        </div>
        <p>And the article rhythm resumes cleanly below.</p>
      </PrtProse>
    </DemoItem>
  </DemoSection>
</template>

<script setup lang="ts">
import DemoItem from '@demo/DemoItem.vue'
import DemoSection from '@demo/DemoSection.vue'
</script>
