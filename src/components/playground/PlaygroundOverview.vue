<script setup>
// Simula una vista de proyectos filtrable y anuncia cambios de selección mediante una región accesible.
import { computed, ref } from 'vue'
import { ArrowRight, ArrowUp, Search } from '@lucide/vue'
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
const activeWorkspaceTab = ref('overview')
const announcement = ref('')
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

const filteredProjects = computed(() => {
  // Combina búsqueda por nombre/propietario con filtros de estado sin alterar la lista fuente.
  const query = search.value.trim().toLowerCase()
  return projects.filter(project => {
    const matchesQuery = !query || `${project.name} ${project.owner}`.toLowerCase().includes(query)
    const matchesFilter = filter.value === 'all'
      || (filter.value === 'active' && project.progress >= 50)
      || (filter.value === 'review' && project.status === 'In review')
    return matchesQuery && matchesFilter
  })
})

function announce(message) {
  announcement.value = message
}

function selectWorkspaceTab(tab) {
  activeWorkspaceTab.value = tab
  announce(`${tab.charAt(0).toUpperCase() + tab.slice(1)} section selected`)
}

function viewAllProjects() {
  search.value = ''
  filter.value = 'all'
  announce('Showing all recent projects')
}
</script>

<template>
  <section class="ds-product-demo" aria-labelledby="product-demo-title">
    <header class="ds-product-demo__header">
      <div class="ds-product-demo__welcome"><p class="ds-product-demo__eyebrow">Northstar workspace</p><DsTypography id="product-demo-title" variant="h2">Good morning, Alex.</DsTypography></div>
      <div class="ds-product-demo__actions"><DsButton variant="ghost" @click="announce('Team invitation opened')">Invite team</DsButton><DsButton @click="announce('New project draft created')">New project</DsButton></div>
    </header>

    <nav class="ds-product-demo__nav" aria-label="Workspace sections">
      <a v-for="tab in ['overview', 'projects', 'library', 'activity']" :key="tab" :href="`#${tab}`" :aria-current="activeWorkspaceTab === tab ? 'page' : undefined" @click.prevent="selectWorkspaceTab(tab)">{{ tab.charAt(0).toUpperCase() + tab.slice(1) }}</a>
    </nav>

    <div class="ds-product-demo__announcement"><DsAlert title="Library update available">Twelve components are ready to publish in version 1.8.</DsAlert></div>

    <div class="ds-product-demo__stats">
      <DsCard class="ds-product-demo__stat" variant="statistic" title="Across three product teams"><template #header><div class="ds-product-demo__stat-heading"><p class="ds-card__metric">24</p><DsTypography variant="h3">Across three product teams</DsTypography></div></template><template #content><DsBadge variant="success"><ArrowUp :size="12" aria-hidden="true" /> 12%</DsBadge></template></DsCard>
      <DsCard class="ds-product-demo__stat" variant="statistic" title="Ready in the shared library"><template #header><div class="ds-product-demo__stat-heading"><p class="ds-card__metric">128</p><DsTypography variant="h3">Ready in the shared library</DsTypography></div></template><template #content><DsBadge>12 new</DsBadge></template></DsCard>
      <DsCard class="ds-product-demo__stat" variant="statistic" title="Mapped to semantic tokens"><template #header><div class="ds-product-demo__stat-heading"><p class="ds-card__metric">86%</p><DsTypography variant="h3">Mapped to semantic tokens</DsTypography></div></template><template #content><DsProgress :value="86" label="Token coverage" /></template></DsCard>
    </div>

    <div class="ds-product-demo__toolbar">
      <DsField id="overview-search" label="Search projects" class="ds-product-demo__search"><DsInput id="overview-search" v-model="search" placeholder="Search by project or owner"><template #icon><Search :size="18" aria-hidden="true" /></template></DsInput></DsField>
      <DsField id="overview-filter" label="Filter"><DsSelect v-model="filter" :options="filterOptions" label="Project filter" /></DsField>
    </div>

    <div class="ds-product-demo__content">
      <section class="ds-product-demo__projects" aria-labelledby="recent-projects-title">
        <div class="ds-product-demo__section-heading"><DsTypography id="recent-projects-title" variant="h3">Recent projects</DsTypography><DsButton variant="ghost" size="small" @click="viewAllProjects">View all</DsButton></div>
        <div class="ds-project-list">
          <article v-for="project in filteredProjects" :key="project.name" class="ds-project-list__item">
            <div><strong>{{ project.name }}</strong><span>{{ project.owner }}</span></div>
            <DsBadge :variant="project.variant">{{ project.status }}</DsBadge>
            <DsProgress :value="project.progress" :label="`${project.name} completion`" />
            <DsButton icon-only variant="ghost" size="small" :label="`Open ${project.name}`" @click="announce(`${project.name} opened`)"><ArrowRight :size="18" aria-hidden="true" /></DsButton>
          </article>
          <p v-if="!filteredProjects.length" class="ds-product-demo__empty">No projects match this search.</p>
        </div>
      </section>

      <DsCard class="ds-product-demo__health" variant="feature" title="Design system health" description="Most foundations are mapped and ready for the next release." badge="Healthy">
        <template #content><ul class="ds-card__feature-list"><li>Colors · 100% mapped</li><li>Typography · 94% mapped</li><li>Spacing · 82% mapped</li><li>Radius · 100% mapped</li></ul></template>
        <DsButton variant="outline" @click="announce('Library review opened')">Review library</DsButton>
      </DsCard>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
  </section>
</template>
