export const COMPONENT_TOKEN_MAP = Object.freeze({
  DsTypography: ['--ds-font-family', '--ds-font-size-body-md', '--ds-color-text-primary-default', '--ds-line-height-body-md'],
  DsButton: ['--ds-color-button-primary-background-default', '--ds-color-button-primary-background-hover', '--ds-color-button-primary-text-default', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-spacing-control-md-inline', '--ds-spacing-control-md-block', '--ds-radius-button-primary'],
  DsToggleGroup: ['--ds-color-bg-fill-primary-default', '--ds-spacing-button-group-gap', '--ds-radius-control-primary'],
  DsInput: ['--ds-color-control-background-default', '--ds-color-control-border-default', '--ds-font-size-control-md', '--ds-control-height-md', '--ds-spacing-control-md-inline', '--ds-radius-input-primary'],
  DsTextarea: ['--ds-color-control-background-default', '--ds-color-control-border-default', '--ds-font-size-control-md', '--ds-spacing-control-md-inline', '--ds-radius-input-primary'],
  DsSelect: ['--ds-color-control-background-default', '--ds-color-control-border-default', '--ds-font-size-control-md', '--ds-control-height-md', '--ds-spacing-control-md-inline', '--ds-radius-input-primary'],
  DsCheckbox: ['--ds-color-bg-fill-primary-default', '--ds-color-control-border-default', '--ds-radius-checkbox-primary'],
  DsRadioGroup: ['--ds-color-bg-fill-primary-default', '--ds-color-control-border-default', '--ds-font-size-body-md'],
  DsSwitch: ['--ds-color-bg-fill-primary-default', '--ds-color-border-secondary-default', '--ds-radius-switch-primary'],
  DsSlider: ['--ds-color-bg-fill-primary-default', '--ds-color-border-primary-default', '--ds-radius-progress-primary'],
  DsCard: ['--ds-color-bg-surface-default', '--ds-color-border-primary-default', '--ds-card-padding', '--ds-card-content-gap', '--ds-radius-card-primary'],
  DsTabs: ['--ds-color-bg-fill-primary-default', '--ds-color-text-secondary-default', '--ds-spacing-card-padding', '--ds-radius-control-primary'],
  DsAccordion: ['--ds-color-bg-surface-default', '--ds-color-border-primary-default', '--ds-spacing-control-md-inline', '--ds-radius-surface-primary'],
  DsDropdownMenu: ['--ds-color-bg-surface-default', '--ds-color-border-primary-default', '--ds-radius-overlay-primary'],
  DsNavigationMenu: ['--ds-color-bg-surface-default', '--ds-color-border-primary-focus', '--ds-radius-overlay-primary'],
  DsPagination: ['--ds-color-bg-fill-primary-default', '--ds-color-border-primary-default', '--ds-radius-control-primary'],
  DsBadge: ['--ds-color-badge-brand-background', '--ds-color-badge-brand-text', '--ds-font-size-badge-primary', '--ds-badge-padding-x', '--ds-radius-badge-primary'],
  DsAlert: ['--ds-color-bg-surface-default', '--ds-color-border-primary-default', '--ds-card-padding', '--ds-radius-surface-primary'],
  DsDialog: ['--ds-color-bg-surface-default', '--ds-color-border-primary-default', '--ds-spacing-section-primary', '--ds-radius-overlay-primary'],
  DsAlertDialog: ['--ds-color-bg-fill-danger-default', '--ds-color-bg-surface-default', '--ds-radius-overlay-primary'],
  DsTooltip: ['--ds-color-text-primary-default', '--ds-color-text-on-primary', '--ds-radius-tooltip-primary'],
  DsPopover: ['--ds-color-bg-surface-default', '--ds-card-padding', '--ds-radius-overlay-primary'],
  DsProgress: ['--ds-color-bg-fill-primary-default', '--ds-color-border-primary-default', '--ds-radius-progress-primary'],
  DsSkeleton: ['--ds-color-bg-surface-muted', '--ds-card-padding', '--ds-radius-card-primary'],
  DsEmptyState: ['--ds-color-bg-surface-default', '--ds-spacing-section-primary', '--ds-radius-card-primary'],
  DsToast: ['--ds-color-bg-surface-default', '--ds-card-padding', '--ds-radius-overlay-primary'],
})

const COMPONENT_VARIANT_TOKEN_MAP = Object.freeze({
  DsTypography: Object.freeze({
    link: Object.freeze(['--ds-font-family', '--ds-color-link-default', '--ds-color-link-hover', '--ds-color-focus-ring', '--ds-font-size-body-md']),
  }),
  DsButton: Object.freeze({
    primary: COMPONENT_TOKEN_MAP.DsButton,
    secondary: Object.freeze(['--ds-color-button-secondary-background-default', '--ds-color-button-secondary-background-hover', '--ds-color-button-secondary-border-default', '--ds-color-button-secondary-text-default', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-radius-button-primary']),
    tertiary: Object.freeze(['--ds-color-button-tertiary-text-default', '--ds-color-button-tertiary-background-hover', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-radius-button-primary']),
    outline: Object.freeze(['--ds-color-button-secondary-background-default', '--ds-color-button-secondary-border-default', '--ds-color-button-secondary-text-default', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-radius-button-primary']),
    ghost: Object.freeze(['--ds-color-button-tertiary-text-default', '--ds-color-button-tertiary-background-hover', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-radius-button-primary']),
    destructive: Object.freeze(['--ds-color-status-error', '--ds-color-text-on-error', '--ds-color-focus-ring', '--ds-font-size-button-primary', '--ds-radius-button-primary']),
  }),
  DsBadge: Object.freeze({
    primary: COMPONENT_TOKEN_MAP.DsBadge,
    secondary: Object.freeze(['--ds-color-bg-surface-default', '--ds-color-selection-border', '--ds-color-badge-brand-text', '--ds-font-size-badge-primary', '--ds-radius-badge-primary']),
    neutral: Object.freeze(['--ds-color-bg-surface-muted', '--ds-color-border-primary-default', '--ds-color-text-secondary-default', '--ds-font-size-badge-primary', '--ds-radius-badge-primary']),
    success: Object.freeze(['--ds-color-status-success', '--ds-color-text-on-success', '--ds-font-size-badge-primary', '--ds-radius-badge-primary']),
    danger: Object.freeze(['--ds-color-status-error', '--ds-color-text-on-error', '--ds-font-size-badge-primary', '--ds-radius-badge-primary']),
  }),
})

export function getComponentTokenNames(component, variant) {
  return COMPONENT_VARIANT_TOKEN_MAP[component]?.[variant]
    ?? COMPONENT_TOKEN_MAP[component]
    ?? DEFAULT_INSPECTOR_TOKENS
}

export const DEFAULT_INSPECTOR_TOKENS = Object.freeze([
  '--ds-color-text-primary-default',
  '--ds-font-size-body-md',
  '--ds-spacing-control-md-inline',
  '--ds-radius-control-primary',
])

export const INSPECTOR_TOKEN_CATEGORIES = Object.freeze([
  { id: 'color', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius', label: 'Radius' },
])

export function getInspectorTokenCategory(name) {
  if (name.startsWith('--ds-color-') || name.startsWith('--color-')) return 'color'
  if (name.includes('font-') || name.includes('line-height') || name.startsWith('--ds-text-')) return 'typography'
  if (name.includes('radius')) return 'radius'
  return 'spacing'
}
