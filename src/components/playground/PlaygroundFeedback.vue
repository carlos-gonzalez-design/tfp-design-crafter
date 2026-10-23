<script setup>
import { ref } from 'vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsAlert from '../design-system/feedback/DsAlert.vue'
import DsAlertDialog from '../design-system/feedback/DsAlertDialog.vue'
import DsBadge from '../design-system/feedback/DsBadge.vue'
import DsDialog from '../design-system/feedback/DsDialog.vue'
import DsEmptyState from '../design-system/feedback/DsEmptyState.vue'
import DsPopover from '../design-system/feedback/DsPopover.vue'
import DsProgress from '../design-system/feedback/DsProgress.vue'
import DsSkeleton from '../design-system/feedback/DsSkeleton.vue'
import DsToast from '../design-system/feedback/DsToast.vue'
import DsTooltip from '../design-system/feedback/DsTooltip.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const announcement = ref('')
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-feedback-title">
    <PlaygroundSectionHeader
      title-id="playground-feedback-title"
      title="Feedback"
      description="Persistent, contextual and modal patterns communicate status with the right level of urgency."
    />
    <div class="ds-feedback-showcase">
      <section class="ds-feedback-showcase__wide ds-feedback-showcase__badges" aria-label="Status badges"><span class="ds-examples__label">Badges</span><div class="ds-examples__buttons"><DsBadge>In progress</DsBadge><DsBadge variant="secondary">Review</DsBadge><DsBadge variant="neutral">Draft</DsBadge><DsBadge variant="success">Published</DsBadge><DsBadge variant="danger">Blocked</DsBadge></div></section>
      <section class="ds-feedback-showcase__wide" aria-label="System alerts"><span class="ds-examples__label">Alerts</span><div class="ds-feedback-showcase__alerts"><DsAlert title="Tokens synchronized" variant="success">Every preview is using the latest Foundation values.</DsAlert><DsAlert title="Library update available">Twelve components are ready to publish.</DsAlert><DsAlert title="Review required" variant="warning">Two components need an accessibility review.</DsAlert><DsAlert title="Export unavailable" variant="danger">Resolve the invalid token reference before exporting.</DsAlert></div></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Progress</span><DsProgress :value="72" label="Library coverage" /></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Contextual overlays</span><div class="ds-examples__buttons"><DsTooltip content="Tokens update this component in real time." /><DsPopover title="Current selection" trigger-label="Open details">DsButton · Primary · Medium</DsPopover></div></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Dialogs</span><div class="ds-examples__buttons"><DsDialog title="Publish library" description="Your latest component changes will become available to the team." trigger-label="Open dialog" /><DsAlertDialog title="Delete project?" description="This action cannot be undone and removes the project for every collaborator." @confirm="announcement = 'Project deleted'" /></div></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Notification</span><DsToast title="Library published" description="Version 1.8 is ready for your team." /></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Skeleton loader</span><DsSkeleton /></section>
      <section class="ds-feedback-showcase__module"><span class="ds-examples__label">Empty state</span><DsEmptyState title="No archived projects" description="Projects you archive will appear here."><DsButton size="small" @click="announcement = 'New project draft created'">Create project</DsButton></DsEmptyState></section>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </div>
  </section>
</template>
