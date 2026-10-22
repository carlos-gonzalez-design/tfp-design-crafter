<script setup>
import DsTypography from '../design-system/core/DsTypography.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'
</script>

<template>
  <section class="ds-playground-section ds-playground-section--typography" aria-labelledby="playground-typography-title">
    <PlaygroundSectionHeader
      title-id="playground-typography-title"
      title="Typography with a point of view"
      description="A confident editorial hierarchy, shaped by the current Typography foundation and designed for comfortable reading."
    />

    <article class="ds-type-editorial" aria-label="Typography editorial composition">
      <header class="ds-type-editorial__hero">
        <span class="ds-examples__label">Hero</span>
        <DsTypography variant="display"><span class="ds-type-editorial__hero-line">Ideas deserve</span> <span class="ds-type-editorial__hero-line">room to grow.</span></DsTypography>
      </header>

      <section class="ds-type-editorial__hierarchy" aria-labelledby="type-hierarchy-title">
        <div class="ds-type-editorial__primary-heading">
          <span class="ds-examples__label">Heading 1</span>
          <DsTypography id="type-hierarchy-title" variant="h1">Make room for good ideas.</DsTypography>
        </div>

        <div class="ds-type-editorial__secondary-heading">
          <span class="ds-examples__label">Heading 2</span>
          <DsTypography variant="h2">Build something considered.</DsTypography>
          <DsTypography variant="body">
            Scale establishes priority; rhythm turns that priority into a reading experience that feels deliberate.
          </DsTypography>
        </div>

        <div class="ds-type-editorial__heading-pair">
          <div>
            <span class="ds-examples__label">Heading 3</span>
            <DsTypography variant="h3">Every detail matters.</DsTypography>
          </div>
          <div>
            <span class="ds-examples__label">Heading 4</span>
            <DsTypography variant="h4">A useful section heading.</DsTypography>
          </div>
        </div>
      </section>

      <section class="ds-type-editorial__reading" aria-label="Reading styles">
        <div class="ds-type-editorial__copy">
          <div>
            <span class="ds-examples__label">Body Large</span>
            <DsTypography variant="body-large">
              A generous introduction creates momentum and invites the reader into the subject.
            </DsTypography>
          </div>
          <div>
            <span class="ds-examples__label">Body</span>
            <DsTypography variant="body">
              A clear visual language brings your next bright idea into focus. Comfortable line length and measured spacing keep longer passages calm and easy to scan.
            </DsTypography>
          </div>
        </div>

        <div class="ds-type-editorial__aside">
          <span class="ds-examples__label">Blockquote</span>
          <DsTypography variant="blockquote">
            Typography gives a product its voice before a single interaction begins.
          </DsTypography>
        </div>
      </section>

      <footer class="ds-type-editorial__details" id="typography-details">
        <div>
          <span class="ds-examples__label">Small</span>
          <DsTypography variant="small">Useful supporting information at a quieter scale.</DsTypography>
        </div>
        <div>
          <span class="ds-examples__label">Caption</span>
          <DsTypography variant="caption">Thoughtful details, consistent at every scale.</DsTypography>
        </div>
        <div>
          <span class="ds-examples__label">Label and link</span>
          <DsTypography variant="label">Project status</DsTypography>
          <DsTypography variant="link" href="#typography-details">Read the typography guide</DsTypography>
        </div>
      </footer>
    </article>
  </section>
</template>
