<script setup>
import { ref } from 'vue'
import { ArrowRight, ArrowUpRight, TrendingUp } from '@lucide/vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsCard from '../design-system/cards/DsCard.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'
import cardImage from '../../assets/hero.png'

const announcement = ref('')

function announce(message) {
  announcement.value = message
}
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-cards-title">
    <PlaygroundSectionHeader
      title-id="playground-cards-title"
      title="Cards"
      description="Purpose-built compositions demonstrate content hierarchy without collapsing into a repeated gallery."
    />
    <div class="ds-card-showcase">
      <DsCard class="ds-card-showcase__manifesto" title="Design foundations" description="A focused starting point for consistent product decisions." />
      <DsCard class="ds-card-showcase__image" variant="image" title="Layers of possibility" description="Give your ideas room to take shape." :image="cardImage" image-alt="Illustration of two floating geometric layers" />
      <DsCard class="ds-card-showcase__product" variant="product" title="Creator workspace" description="Everything your team needs to move from tokens to product." badge="Product">
        <template #content><p class="ds-card__price">€24 <span>/ month</span></p></template>
        <DsButton @click="announce('Creator workspace details opened')">View details</DsButton>
      </DsCard>
      <DsCard class="ds-card-showcase__profile" variant="profile" title="Maya Chen" description="Product designer · Lisbon">
        <template #media><div class="ds-card__avatar" aria-hidden="true">MC</div></template>
        <DsButton variant="outline" size="small" @click="announce('Maya Chen profile opened')">View profile</DsButton>
      </DsCard>
      <DsCard class="ds-card-showcase__pricing" variant="pricing" title="Studio" description="For teams building a shared visual language." badge="Most popular">
        <template #content><p class="ds-card__price">€48 <span>/ month</span></p><ul class="ds-card__feature-list"><li>Unlimited projects</li><li>Shared component library</li><li>Token export</li></ul></template>
        <DsButton @click="announce('Studio trial started')">Start free trial</DsButton>
      </DsCard>
      <DsCard variant="feature" title="Built for handoff" description="Every decision remains inspectable, reusable and ready to export.">
        <template #eyebrow><span class="ds-card__feature-icon" aria-hidden="true"><ArrowUpRight :size="18" /></span></template>
      </DsCard>
      <DsCard variant="statistic" title="Components published" description="Across four active product teams.">
        <template #header><p class="ds-card__metric">128</p></template>
        <template #content><span class="ds-card__trend"><TrendingUp :size="16" aria-hidden="true" /> 18% this month</span></template>
      </DsCard>
      <DsCard class="ds-card-showcase__horizontal" variant="horizontal" title="A system that travels" description="Bring the same foundations from a compact control to an entire experience." :image="cardImage" image-alt="Abstract layered forms" />
      <DsCard variant="interactive" title="Open project canvas" description="Continue refining the Atlas workspace." interactive badge="Updated 8 min ago" @activate="announce('Atlas project canvas opened')">
        <DsButton variant="ghost" @click.stop="announce('Atlas project canvas opened')"><template #icon><ArrowRight :size="18" aria-hidden="true" /></template>Open project</DsButton>
      </DsCard>
      <DsCard variant="badge" title="Accessibility review" description="All critical flows have passed keyboard and focus checks." badge="Passed" />
      <DsCard class="ds-card-showcase__cta" variant="cta" title="Ready to explore?" description="Create a consistent experience, one thoughtful detail at a time.">
        <DsButton @click="announce('Component collection opened')">Explore collection</DsButton><DsButton variant="ghost" @click="announce('Design system guide opened')">Learn more</DsButton>
      </DsCard>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </div>
  </section>
</template>
