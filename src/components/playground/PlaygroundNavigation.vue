<script setup>
import { ref } from 'vue'
import DsAccordion from '../design-system/navigation/DsAccordion.vue'
import DsBreadcrumbs from '../design-system/navigation/DsBreadcrumbs.vue'
import DsDropdownMenu from '../design-system/navigation/DsDropdownMenu.vue'
import DsNavigationMenu from '../design-system/navigation/DsNavigationMenu.vue'
import DsPagination from '../design-system/navigation/DsPagination.vue'
import DsSegmentedControl from '../design-system/navigation/DsSegmentedControl.vue'
import DsTabs from '../design-system/navigation/DsTabs.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const activeTab = ref('overview')
const page = ref(3)
const view = ref('grid')
const lastAction = ref('No action selected')
const tabs = [
  { value: 'overview', label: 'Overview', content: 'A concise summary of the selected project.' },
  { value: 'activity', label: 'Activity', content: 'Recent changes and collaborative updates.' },
  { value: 'settings', label: 'Settings', content: 'Configuration options for this workspace.', disabled: true },
]
const breadcrumbs = [{ label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Atlas' }]
const accordionItems = [
  { value: 'foundations', label: 'How do Foundations stay reactive?', content: 'Components reference semantic aliases that resolve to the current Foundation values.' },
  { value: 'accessibility', label: 'Which interactions are accessible?', content: 'Reka UI manages focus, keyboard navigation and ARIA behavior for headless primitives.' },
  { value: 'export', label: 'Can these components be exported?', content: 'The token references and component boundaries are structured for future export.' },
]
const dropdownItems = [
  { value: 'rename', label: 'Rename project', shortcut: 'R' },
  { value: 'duplicate', label: 'Duplicate', shortcut: 'D' },
  { separator: true, value: 'separator' },
  { value: 'archive', label: 'Archive project' },
]
const navigationItems = [
  { label: 'Products', children: [{ label: 'Foundations', description: 'Shape the visual language.' }, { label: 'Components', description: 'Compose reusable UI.' }] },
  { label: 'Resources', children: [{ label: 'Guidelines', description: 'Learn how the system works.' }, { label: 'Changelog', description: 'Review recent decisions.' }] },
  { label: 'About', href: '#' },
]
const views = [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'board', label: 'Board' }]
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-navigation-title">
    <PlaygroundSectionHeader
      title-id="playground-navigation-title"
      title="Navigation"
      description="Headless navigation patterns preserve keyboard behavior while sharing one token-driven visual layer."
    />
    <div class="ds-navigation-showcase">
      <div class="ds-navigation-showcase__wide"><span class="ds-examples__label">Breadcrumbs</span><DsBreadcrumbs :items="breadcrumbs" /></div>
      <div class="ds-navigation-showcase__wide"><span class="ds-examples__label">Navigation menu</span><DsNavigationMenu :items="navigationItems" /></div>
      <div class="ds-navigation-showcase__wide"><span class="ds-examples__label">Tabs</span><DsTabs v-model="activeTab" :tabs="tabs" label="Example project sections" /></div>
      <div><span class="ds-examples__label">Dropdown menu</span><DsDropdownMenu label="Project actions" :items="dropdownItems" @select="lastAction = $event" /><p class="ds-navigation-showcase__status" aria-live="polite">{{ lastAction }}</p></div>
      <div><span class="ds-examples__label">Segmented control</span><DsSegmentedControl v-model="view" :items="views" label="Layout view" /></div>
      <div class="ds-navigation-showcase__wide"><span class="ds-examples__label">Pagination</span><DsPagination v-model:page="page" :total="120" :items-per-page="10" /></div>
      <div class="ds-navigation-showcase__wide"><span class="ds-examples__label">Accordion</span><DsAccordion :items="accordionItems" default-value="foundations" /></div>
    </div>
  </section>
</template>
