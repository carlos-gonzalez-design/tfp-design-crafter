<script setup>
import { ref } from 'vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsCard from '../design-system/cards/DsCard.vue'
import DsAlert from '../design-system/feedback/DsAlert.vue'
import DsBadge from '../design-system/feedback/DsBadge.vue'
import DsProgress from '../design-system/feedback/DsProgress.vue'
import DsField from '../design-system/forms/DsField.vue'
import DsInput from '../design-system/forms/DsInput.vue'
import DsSelect from '../design-system/forms/DsSelect.vue'
import DsTypography from '../design-system/core/DsTypography.vue'

const search = ref('')
const filter = ref('all')
const filterOptions = [
  { value: 'all', label: 'All projects' },
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'In review' },
]

const projects = [
  { name: 'Atlas mobile', owner: 'Maya Chen', status: 'Published', variant: 'success', progress: 92 },
  { name: 'Merchant portal', owner: 'Alex Morgan', status: 'In review', variant: 'secondary', progress: 68 },
  { name: 'Checkout refresh', owner: 'Noah Williams', status: 'Draft', variant: 'neutral', progress: 41 },
]
</script>

<template>
  <section class="ds-product-demo" aria-labelledby="product-demo-title">
    <header class="ds-product-demo__header">
      <div><p class="ds-product-demo__eyebrow">Northstar workspace</p><DsTypography id="product-demo-title" variant="h2">Good morning, Alex.</DsTypography></div>
      <div class="ds-examples__buttons"><DsButton variant="ghost">Invite team</DsButton><DsButton>New project</DsButton></div>
    </header>

    <nav class="ds-product-demo__nav" aria-label="Workspace sections">
      <a href="#overview" aria-current="page">Overview</a><a href="#projects">Projects</a><a href="#library">Library</a><a href="#activity">Activity</a>
    </nav>

    <DsAlert title="Library update available">Twelve components are ready to publish in version 1.8.</DsAlert>

    <div class="ds-product-demo__stats">
      <DsCard variant="statistic" title="Active projects" description="Across three product teams"><template #header><p class="ds-card__metric">24</p></template><template #content><DsBadge variant="success">↑ 12%</DsBadge></template></DsCard>
      <DsCard variant="statistic" title="Components" description="Ready in the shared library"><template #header><p class="ds-card__metric">128</p></template><template #content><DsBadge>12 new</DsBadge></template></DsCard>
      <DsCard variant="statistic" title="Coverage" description="Mapped to semantic tokens"><template #header><p class="ds-card__metric">86%</p></template><template #content><DsProgress :value="86" label="Token coverage" /></template></DsCard>
    </div>

    <div class="ds-product-demo__toolbar">
      <DsField id="overview-search" label="Search projects" class="ds-product-demo__search"><DsInput id="overview-search" v-model="search" icon="⌕" placeholder="Search by project or owner" /></DsField>
      <DsField id="overview-filter" label="Filter"><DsSelect v-model="filter" :options="filterOptions" label="Project filter" /></DsField>
    </div>

    <div class="ds-product-demo__content">
      <section class="ds-product-demo__projects" aria-labelledby="recent-projects-title">
        <div class="ds-product-demo__section-heading"><DsTypography id="recent-projects-title" variant="h3">Recent projects</DsTypography><DsButton variant="ghost" size="small">View all</DsButton></div>
        <div class="ds-project-list">
          <article v-for="project in projects" :key="project.name" class="ds-project-list__item">
            <div><strong>{{ project.name }}</strong><span>{{ project.owner }}</span></div>
            <DsBadge :variant="project.variant">{{ project.status }}</DsBadge>
            <DsProgress :value="project.progress" :label="`${project.name} completion`" />
            <DsButton icon-only variant="ghost" size="small" :label="`Open ${project.name}`">→</DsButton>
          </article>
        </div>
      </section>

      <DsCard variant="feature" title="Design system health" description="Most foundations are mapped and ready for the next release." badge="Healthy">
        <template #content><ul class="ds-card__feature-list"><li>Colors · 100% mapped</li><li>Typography · 94% mapped</li><li>Spacing · 82% mapped</li><li>Radius · 100% mapped</li></ul></template>
        <DsButton variant="outline">Review library</DsButton>
      </DsCard>
    </div>
  </section>
</template>
