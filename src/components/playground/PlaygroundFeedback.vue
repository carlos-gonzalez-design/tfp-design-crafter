<script setup>
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
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-feedback-title">
    <PlaygroundSectionHeader
      title-id="playground-feedback-title"
      title="Feedback"
      description="Persistent, contextual and modal feedback patterns communicate status without losing the system language."
    />
    <div class="ds-feedback-showcase">
      <div class="ds-feedback-showcase__wide"><span class="ds-examples__label">Badges</span><div class="ds-examples__buttons"><DsBadge>In progress</DsBadge><DsBadge variant="secondary">Review</DsBadge><DsBadge variant="neutral">Draft</DsBadge><DsBadge variant="success">Published</DsBadge><DsBadge variant="danger">Blocked</DsBadge></div></div>
      <div class="ds-feedback-showcase__wide"><span class="ds-examples__label">Alerts</span><div class="ds-feedback-showcase__alerts"><DsAlert title="Tokens synchronized">Every preview is using the latest Foundation values.</DsAlert><DsAlert title="Review required" variant="warning">Two components need an accessibility review.</DsAlert><DsAlert title="Export unavailable" variant="danger">Resolve the invalid token reference before exporting.</DsAlert></div></div>
      <div><span class="ds-examples__label">Progress</span><DsProgress :value="72" label="Library coverage" /></div>
      <div><span class="ds-examples__label">Contextual overlays</span><div class="ds-examples__buttons"><DsTooltip content="Tokens update this component in real time." /><DsPopover title="Current selection" trigger-label="Open details">DsButton · Primary · Medium</DsPopover></div></div>
      <div><span class="ds-examples__label">Dialogs</span><div class="ds-examples__buttons"><DsDialog title="Publish library" description="Your latest component changes will become available to the team." trigger-label="Open dialog" /><DsAlertDialog title="Delete project?" description="This action cannot be undone and removes the project for every collaborator." /></div></div>
      <div><span class="ds-examples__label">Notification</span><DsToast title="Library published" description="Version 1.8 is ready for your team." /></div>
      <div><span class="ds-examples__label">Skeleton loader</span><DsSkeleton /></div>
      <div><span class="ds-examples__label">Empty state</span><DsEmptyState title="No archived projects" description="Projects you archive will appear here."><DsButton size="small">Create project</DsButton></DsEmptyState></div>
    </div>
  </section>
</template>
