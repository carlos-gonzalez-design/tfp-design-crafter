<script setup>
import DashboardScrollShowcase from './DashboardScrollShowcase.vue'

defineProps({ theme: { type: String, required: true } })
</script>

<template>
  <section class="landing-hero" aria-labelledby="landing-hero-title">
    <div class="landing-container landing-hero__inner">
      <div class="landing-hero__copy" data-reveal>
        <p class="landing-eyebrow"><span></span>A Visual Design Playground</p>
        <h1 id="landing-hero-title">
          <span>Craft your system.</span>
          <em>Shape your design.</em>
        </h1>
        <p class="landing-hero__description">Build your foundations, customize components and see your design system come to life. All in one interactive playground.</p>
        <div class="landing-actions">
          <a class="landing-link landing-link--brand" href="/app" data-app-link>Start crafting <span aria-hidden="true">↗</span></a>
          <a class="landing-link landing-link--light" href="#features">Explore features <span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <DashboardScrollShowcase :theme="theme" />
    </div>
  </section>
</template>
