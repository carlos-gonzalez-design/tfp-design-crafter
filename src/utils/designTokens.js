// One transformation feeds the scoped canvas, UI Kit and CSS export.
export const SPACING_SCALE = Object.freeze([
  { name: 'none', value: 0 },
  { name: '4xs', value: 2 },
  { name: '3xs', value: 4 },
  { name: '2xs', value: 6 },
  { name: 'xs', value: 8 },
  { name: 'sm', value: 12 },
  { name: 'md', value: 16 },
  { name: 'lg', value: 24 },
  { name: 'xl', value: 32 },
  { name: '2xl', value: 48 },
  { name: '3xl', value: 64 },
])

export const DENSITY_CONFIG = Object.freeze({
  compact: Object.freeze({
    cardPadding: 'sm',
    cardContentGap: 'xs',
    cardImageGap: 'sm',
    cardActionsGap: 'sm',
    buttonGroupGap: 'xs',
    controlPaddingInline: 'sm',
    controlPaddingBlock: '2xs',
    sectionGap: 'lg',
    layoutGap: 'xl',
  }),
  default: Object.freeze({
    cardPadding: 'md',
    cardContentGap: 'sm',
    cardImageGap: 'md',
    cardActionsGap: 'md',
    buttonGroupGap: 'sm',
    controlPaddingInline: 'md',
    controlPaddingBlock: 'xs',
    sectionGap: 'xl',
    layoutGap: '2xl',
  }),
  spacious: Object.freeze({
    cardPadding: 'lg',
    cardContentGap: 'md',
    cardImageGap: 'lg',
    cardActionsGap: 'lg',
    buttonGroupGap: 'md',
    controlPaddingInline: 'lg',
    controlPaddingBlock: 'sm',
    sectionGap: '2xl',
    layoutGap: '3xl',
  }),
})

export const RADIUS_PRIMITIVES = Object.freeze([
  Object.freeze({ name: 'none', value: 0 }),
  Object.freeze({ name: 'sm', value: 4 }),
  Object.freeze({ name: 'md', value: 6 }),
  Object.freeze({ name: 'lg', value: 8 }),
  Object.freeze({ name: 'xl', value: 12 }),
  Object.freeze({ name: '2xl', value: 20 }),
  Object.freeze({ name: 'full', value: 9999 }),
  Object.freeze({ name: 'circle', value: '50%' }),
])

export const RADIUS_OPTIONS = Object.freeze({
  button: Object.freeze({
    label: 'Button Shape',
    description: 'Choose a consistent silhouette for every button size and variant.',
    options: Object.freeze([
      Object.freeze({ id: 'square', label: 'Square', token: 'none', value: 0 }),
      Object.freeze({ id: 'rounded', label: 'Rounded', token: 'lg', value: 8 }),
      Object.freeze({ id: 'pill', label: 'Pill', token: 'full', value: 9999 }),
    ]),
  }),
  card: Object.freeze({
    label: 'Card Corners',
    description: 'Set the curvature for cards and related containment surfaces.',
    options: Object.freeze([
      Object.freeze({ id: 'sharp', label: 'Sharp', token: 'none', value: 0 }),
      Object.freeze({ id: 'subtle', label: 'Subtle', token: 'sm', value: 4 }),
      Object.freeze({ id: 'rounded', label: 'Rounded', token: 'xl', value: 12 }),
      Object.freeze({ id: 'soft', label: 'Soft', token: '2xl', value: 20 }),
    ]),
  }),
  input: Object.freeze({
    label: 'Input Corners',
    description: 'Apply one corner treatment to text fields, textareas and selects.',
    options: Object.freeze([
      Object.freeze({ id: 'square', label: 'Square', token: 'none', value: 0 }),
      Object.freeze({ id: 'subtle', label: 'Subtle', token: 'md', value: 6 }),
      Object.freeze({ id: 'rounded', label: 'Rounded', token: 'xl', value: 12 }),
    ]),
  }),
})

const RADIUS_DEFAULTS = Object.freeze({ button: 'rounded', card: 'rounded', input: 'subtle' })

export function getRadiusDecision(radius, category) {
  const definition = RADIUS_OPTIONS[category]
  const selected = radius?.[category] ?? RADIUS_DEFAULTS[category]
  return definition.options.find(option => option.id === selected)
    ?? definition.options.find(option => option.id === RADIUS_DEFAULTS[category])
}

export const TYPE_SCALE_RATIOS = Object.freeze([
  { value: 1.125, label: 'Major Second' },
  { value: 1.2, label: 'Minor Third' },
  { value: 1.25, label: 'Major Third' },
  { value: 1.333, label: 'Perfect Fourth' },
])

export const TYPE_BASE_SIZE_MIN = 8
export const TYPE_BASE_SIZE_MAX = 32

export const TYPE_PRIMITIVE_SCALE = Object.freeze([
  Object.freeze({ name: '2xs', step: -3 }),
  Object.freeze({ name: 'xs', step: -2 }),
  Object.freeze({ name: 'sm', step: -1 }),
  Object.freeze({ name: 'base', step: 0 }),
  Object.freeze({ name: 'lg', step: 1 }),
  Object.freeze({ name: 'xl', step: 2 }),
  Object.freeze({ name: '2xl', step: 3 }),
  Object.freeze({ name: '3xl', step: 4 }),
  Object.freeze({ name: '4xl', step: 5 }),
  Object.freeze({ name: '5xl', step: 6 }),
  Object.freeze({ name: '6xl', step: 7 }),
])

export const TYPE_SEMANTIC_TOKENS = Object.freeze({
  h1: Object.freeze({ label: 'Heading 1', cssName: 'heading-1', defaultSize: '3xl', defaultWeight: '700' }),
  h2: Object.freeze({ label: 'Heading 2', cssName: 'heading-2', defaultSize: '2xl', defaultWeight: '700' }),
  h3: Object.freeze({ label: 'Heading 3', cssName: 'heading-3', defaultSize: 'xl', defaultWeight: '600' }),
  bodyLarge: Object.freeze({ label: 'Body Large', cssName: 'body-large', defaultSize: 'lg', defaultWeight: '400' }),
  body: Object.freeze({ label: 'Body', cssName: 'body', defaultSize: 'base', defaultWeight: '400' }),
  small: Object.freeze({ label: 'Small', cssName: 'small', defaultSize: 'sm', defaultWeight: '400' }),
  caption: Object.freeze({ label: 'Caption', cssName: 'caption', defaultSize: 'xs', defaultWeight: '400' }),
})

const FONT_WEIGHTS_BY_FAMILY = Object.freeze({
  'Inter, sans-serif': Object.freeze(['400', '500', '600', '700']),
  'Arial, sans-serif': Object.freeze(['400', '700']),
  'Georgia, serif': Object.freeze(['400', '700']),
  "'Trebuchet MS', sans-serif": Object.freeze(['400', '700']),
})

export function getAvailableFontWeights(fontFamily) {
  return FONT_WEIGHTS_BY_FAMILY[fontFamily] ?? FONT_WEIGHTS_BY_FAMILY['Inter, sans-serif']
}

export function formatTypeSizeRem(value) {
  return `${Number((value / 16).toFixed(4))}rem`
}

export function getTypographyScale(typography) {
  const requestedBaseSize = Number(typography.baseSize)
  const baseSize = Number.isFinite(requestedBaseSize)
    ? Math.min(TYPE_BASE_SIZE_MAX, Math.max(TYPE_BASE_SIZE_MIN, requestedBaseSize))
    : 16
  const requestedRatio = Number(typography.scaleRatio)
  const ratio = Number.isFinite(requestedRatio) && requestedRatio > 1 ? requestedRatio : 1.25
  return TYPE_PRIMITIVE_SCALE.map(({ name, step }) => {
    const rawValue = baseSize * ratio ** step
    return {
      step,
      name,
      token: `--ds-font-size-${name}`,
      value: Number(rawValue.toFixed(4)),
      remValue: formatTypeSizeRem(rawValue),
    }
  })
}

export function getTypographySemanticScale(typography) {
  const scale = getTypographyScale(typography)
  const byName = new Map(scale.map(token => [token.name, token]))
  const availableWeights = getAvailableFontWeights(typography.fontFamily)

  return Object.fromEntries(Object.entries(TYPE_SEMANTIC_TOKENS).map(([name, definition]) => {
    const configuredStyle = typography.semanticStyles?.[name] ?? {}
    const primitive = byName.get(configuredStyle.size) ?? byName.get(definition.defaultSize)
    const requestedWeight = String(configuredStyle.weight ?? definition.defaultWeight)
    const weight = availableWeights.includes(requestedWeight)
      ? requestedWeight
      : availableWeights.reduce((closest, option) => (
        Math.abs(Number(option) - Number(requestedWeight)) < Math.abs(Number(closest) - Number(requestedWeight)) ? option : closest
      ))
    return [name, {
      ...primitive,
      semantic: name,
      label: definition.label,
      semanticToken: `--ds-text-${definition.cssName}`,
      weight,
      weightToken: `--ds-text-${definition.cssName}-weight`,
    }]
  }))
}

const SPACING_VALUES = Object.freeze(Object.fromEntries(
  SPACING_SCALE.map(token => [token.name, token.value]),
))

export function normalizeDensity(density) {
  return Object.hasOwn(DENSITY_CONFIG, density) ? density : 'default'
}

export function getAppliedSpacing(density) {
  const resolvedDensity = normalizeDensity(density)
  return Object.fromEntries(Object.entries(DENSITY_CONFIG[resolvedDensity]).map(([name, token]) => [
    name,
    { token, value: SPACING_VALUES[token] },
  ]))
}

const FOUNDATION_TOKEN_FILTERS = Object.freeze({
  colors: name => name.startsWith('--ds-color-') || name.startsWith('--ds-button-on-'),
  typography: name => name.startsWith('--ds-font-')
    || name.startsWith('--ds-text-')
    || name.startsWith('--ds-line-height-')
    || name.startsWith('--ds-letter-spacing-'),
  spacing: name => name === '--ds-density'
    || name.startsWith('--ds-space-')
    || name.startsWith('--ds-spacing-')
    || /--ds-(?:card|button|badge).*(?:padding|gap)/.test(name),
  radius: name => name.startsWith('--ds-radius-'),
})

export function getFoundationTokens(cssVariables, foundation) {
  const matchesFoundation = FOUNDATION_TOKEN_FILTERS[foundation] ?? (() => false)
  return Object.fromEntries(Object.entries(cssVariables).filter(([name]) => matchesFoundation(name)))
}

function onAccent(hex) {
  const channels = hex.slice(1).match(/../g).map(channel => {
    const value = parseInt(channel, 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000000' : '#ffffff'
}

export function createDesignTokens(foundations) {
  const { colors, typography, spacing, radius } = foundations
  const density = normalizeDensity(spacing.density)
  const densityConfig = DENSITY_CONFIG[density]
  const typeScale = getTypographyScale(typography)
  const semanticType = getTypographySemanticScale(typography)
  const baseTypeSize = typeScale.find(token => token.step === 0)
  const buttonRadius = getRadiusDecision(radius, 'button')
  const cardRadius = getRadiusDecision(radius, 'card')
  const inputRadius = getRadiusDecision(radius, 'input')
  const surfaceLargeToken = ({ sharp: 'sm', subtle: 'lg', rounded: '2xl', soft: '2xl' })[cardRadius.id]
  const surfaceInnerToken = ({ sharp: 'none', subtle: 'none', rounded: 'lg', soft: 'xl' })[cardRadius.id]

  return {
    '--ds-color-primary': colors.primary,
    '--ds-color-secondary': colors.secondary,
    '--ds-color-background': colors.background,
    '--ds-color-surface': colors.surface,
    '--ds-color-text': colors.text,
    '--ds-color-text-muted': 'color-mix(in srgb, var(--ds-color-text) 72%, var(--ds-color-surface))',
    '--ds-color-border': 'color-mix(in srgb, var(--ds-color-text) 18%, var(--ds-color-surface))',
    '--ds-button-on-accent': onAccent(colors.primary),
    '--ds-button-on-secondary': onAccent(colors.secondary),
    '--ds-color-bg-canvas-default': 'var(--ds-color-background)',
    '--ds-color-bg-surface-default': 'var(--ds-color-surface)',
    '--ds-color-bg-surface-muted': 'color-mix(in srgb, var(--ds-color-text) 4%, var(--ds-color-surface))',
    '--ds-color-bg-fill-primary-default': 'var(--ds-color-primary)',
    '--ds-color-bg-fill-primary-hover': 'color-mix(in srgb, var(--ds-color-primary) 88%, var(--ds-color-text))',
    '--ds-color-bg-fill-primary-active': 'color-mix(in srgb, var(--ds-color-primary) 78%, var(--ds-color-text))',
    '--ds-color-bg-fill-secondary-default': 'var(--ds-color-secondary)',
    '--ds-color-bg-fill-secondary-hover': 'color-mix(in srgb, var(--ds-color-secondary) 88%, var(--ds-color-text))',
    '--ds-color-bg-fill-secondary-active': 'color-mix(in srgb, var(--ds-color-secondary) 78%, var(--ds-color-text))',
    '--ds-color-bg-fill-danger-default': 'var(--ds-color-secondary)',
    '--ds-color-bg-fill-danger-hover': 'color-mix(in srgb, var(--ds-color-secondary) 82%, var(--ds-color-text))',
    '--ds-color-text-primary-default': 'var(--ds-color-text)',
    '--ds-color-text-secondary-default': 'var(--ds-color-text-muted)',
    '--ds-color-text-on-primary': 'var(--ds-button-on-accent)',
    '--ds-color-text-on-secondary': 'var(--ds-button-on-secondary)',
    '--ds-color-text-danger-default': 'color-mix(in srgb, var(--ds-color-secondary) 78%, var(--ds-color-text))',
    '--ds-color-border-primary-default': 'var(--ds-color-border)',
    '--ds-color-border-primary-focus': 'var(--ds-color-primary)',
    '--ds-color-border-secondary-default': 'color-mix(in srgb, var(--ds-color-text) 30%, var(--ds-color-surface))',
    '--ds-color-border-danger-default': 'var(--ds-color-secondary)',
    '--ds-color-button-primary-default': 'var(--ds-color-bg-fill-primary-default)',
    '--ds-color-button-primary-hover': 'var(--ds-color-bg-fill-primary-hover)',
    '--ds-color-button-primary-active': 'var(--ds-color-bg-fill-primary-active)',
    '--ds-color-button-secondary-default': 'var(--ds-color-bg-fill-secondary-default)',
    '--ds-color-button-secondary-hover': 'var(--ds-color-bg-fill-secondary-hover)',
    '--ds-color-button-secondary-active': 'var(--ds-color-bg-fill-secondary-active)',
    '--ds-color-control-background-default': 'var(--ds-color-bg-surface-default)',
    '--ds-color-control-background-hover': 'var(--ds-color-bg-surface-muted)',
    '--ds-color-control-border-default': 'var(--ds-color-border-secondary-default)',
    '--ds-color-control-border-focus': 'var(--ds-color-border-primary-focus)',
    '--ds-color-control-placeholder': 'var(--ds-color-text-secondary-default)',
    '--ds-font-family': typography.fontFamily,
    '--ds-font-base-size': baseTypeSize.remValue,
    '--ds-font-scale-ratio': Number(typography.scaleRatio) || 1.25,
    ...Object.fromEntries(typeScale.map(token => [
      token.token,
      token.remValue,
    ])),
    ...Object.fromEntries(Object.values(semanticType).map(token => [
      token.semanticToken,
      `var(${token.token})`,
    ])),
    ...Object.fromEntries(Object.values(semanticType).map(token => [
      token.weightToken,
      token.weight,
    ])),
    '--ds-font-size-display-primary': 'var(--ds-text-heading-1)',
    '--ds-font-size-heading-primary': 'var(--ds-text-heading-1)',
    '--ds-font-size-heading-secondary': 'var(--ds-text-heading-2)',
    '--ds-font-size-heading-tertiary': 'var(--ds-text-heading-3)',
    '--ds-font-size-body-lg': 'var(--ds-text-body-large)',
    '--ds-font-size-body-md': 'var(--ds-text-body)',
    '--ds-font-size-body-sm': 'var(--ds-text-small)',
    '--ds-font-size-label-sm': 'var(--ds-text-small)',
    '--ds-font-size-caption-sm': 'var(--ds-text-caption)',
    '--ds-font-weight-heading-primary': 'var(--ds-text-heading-1-weight)',
    '--ds-font-weight-heading-secondary': 'var(--ds-text-heading-2-weight)',
    '--ds-font-weight-heading-tertiary': 'var(--ds-text-heading-3-weight)',
    '--ds-font-weight-body-md': 'var(--ds-text-body-weight)',
    '--ds-font-weight-label-sm': 'var(--ds-text-small-weight)',
    '--ds-line-height-heading-primary': 1.2,
    '--ds-line-height-heading-secondary': 1.25,
    '--ds-line-height-body-md': 1.6,
    '--ds-line-height-control-md': 1.5,
    '--ds-letter-spacing-heading-primary': '-0.025em',
    '--ds-letter-spacing-label-sm': '0.01em',
    '--ds-font-size-button-primary': 'var(--ds-font-size-body-md)',
    '--ds-font-weight-button-primary': 'var(--ds-font-weight-body-md)',
    '--ds-font-size-control-md': 'var(--ds-font-size-body-md)',
    '--ds-font-size-badge-primary': 'var(--ds-font-size-caption-sm)',
    '--ds-density': density,
    ...Object.fromEntries(SPACING_SCALE.map(token => [`--ds-space-${token.name}`, `${token.value}px`])),
    '--ds-spacing-card-padding': `var(--ds-space-${densityConfig.cardPadding})`,
    '--ds-spacing-card-content-gap': `var(--ds-space-${densityConfig.cardContentGap})`,
    '--ds-spacing-card-image-gap': `var(--ds-space-${densityConfig.cardImageGap})`,
    '--ds-spacing-card-actions-gap': `var(--ds-space-${densityConfig.cardActionsGap})`,
    '--ds-spacing-button-group-gap': `var(--ds-space-${densityConfig.buttonGroupGap})`,
    '--ds-spacing-layout-primary': `var(--ds-space-${densityConfig.layoutGap})`,
    '--ds-spacing-section-primary': `var(--ds-space-${densityConfig.sectionGap})`,
    '--ds-spacing-control-md-inline': `var(--ds-space-${densityConfig.controlPaddingInline})`,
    '--ds-spacing-control-md-block': `var(--ds-space-${densityConfig.controlPaddingBlock})`,
    '--ds-card-padding': 'var(--ds-spacing-card-padding)',
    '--ds-card-content-gap': 'var(--ds-spacing-card-content-gap)',
    '--ds-card-image-gap': 'var(--ds-spacing-card-image-gap)',
    '--ds-card-actions-gap': 'var(--ds-spacing-card-actions-gap)',
    '--ds-button-group-gap': 'var(--ds-spacing-button-group-gap)',
    '--ds-button-sm-padding-x': `var(--ds-space-${densityConfig.buttonGroupGap})`,
    '--ds-button-sm-padding-y': `var(--ds-space-${density === 'compact' ? '3xs' : density === 'spacious' ? 'xs' : '2xs'})`,
    '--ds-button-md-padding-x': `var(--ds-space-${densityConfig.controlPaddingInline})`,
    '--ds-button-md-padding-y': `var(--ds-space-${densityConfig.controlPaddingBlock})`,
    '--ds-button-lg-padding-x': `var(--ds-space-${density === 'compact' ? 'md' : density === 'spacious' ? 'xl' : 'lg'})`,
    '--ds-button-lg-padding-y': `var(--ds-space-${density === 'compact' ? 'xs' : density === 'spacious' ? 'md' : 'sm'})`,
    '--ds-button-gap': 'var(--ds-space-3xs)',
    '--ds-badge-padding-x': 'var(--ds-space-xs)',
    '--ds-badge-padding-y': 'var(--ds-space-3xs)',
    '--ds-badge-gap': 'var(--ds-space-3xs)',
    ...Object.fromEntries(RADIUS_PRIMITIVES.map(token => [`--ds-radius-${token.name}`, typeof token.value === 'number' ? `${token.value}px` : token.value])),
    '--ds-radius-control-small': 'var(--ds-radius-sm)',
    '--ds-radius-control-primary': `var(--ds-radius-${inputRadius.token})`,
    '--ds-radius-surface-primary': `var(--ds-radius-${cardRadius.token})`,
    '--ds-radius-surface-inner': `var(--ds-radius-${surfaceInnerToken})`,
    '--ds-radius-surface-large': `var(--ds-radius-${surfaceLargeToken})`,
    '--ds-radius-shape-pill': 'var(--ds-radius-full)',
    '--ds-radius-shape-circle': 'var(--ds-radius-circle)',
    '--ds-radius-button-primary': `var(--ds-radius-${buttonRadius.token})`,
    '--ds-radius-card-primary': 'var(--ds-radius-surface-primary)',
    '--ds-radius-input-primary': 'var(--ds-radius-control-primary)',
    '--ds-radius-badge-primary': 'var(--ds-radius-shape-pill)',
    '--ds-radius-checkbox-primary': 'var(--ds-radius-control-small)',
    '--ds-radius-switch-primary': 'var(--ds-radius-shape-pill)',
    '--ds-radius-progress-primary': 'var(--ds-radius-shape-pill)',
    '--ds-radius-tooltip-primary': 'var(--ds-radius-control-small)',
    '--ds-radius-overlay-primary': 'var(--ds-radius-surface-large)',
  }
}

const PRIMITIVE_TOKEN_PATTERN = /--ds-(?:color-(?:primary|secondary|background|surface|text)$|font-size-(?:2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$|space-(?:none|4xs|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl)$|radius-(?:none|sm|md|lg|xl|2xl|full|circle)$)/
const COMPONENT_TOKEN_PATTERN = /--ds-(?:color-(?:button|control)-|font-(?:size|weight)-(?:button|control|badge)-|spacing-(?:button|card)-|radius-(?:button|card|input|badge|checkbox|switch|progress|tooltip|overlay)-|(?:button|card|badge)-)/

export function getDesignTokenLevel(name) {
  return PRIMITIVE_TOKEN_PATTERN.test(name) ? 'Primitive' : COMPONENT_TOKEN_PATTERN.test(name) ? 'Component' : 'Semantic'
}

function getTokenType(name) {
  if (name.includes('color') || name.includes('on-accent') || name.includes('on-secondary')) return 'color'
  if (name.includes('font') || name.includes('text-') || name.includes('line-height') || name.includes('letter-spacing')) return 'typography'
  if (name.includes('spacing') || name.includes('space-') || name.includes('padding') || name.includes('gap')) return 'dimension'
  if (name.includes('radius')) return 'borderRadius'
  return 'other'
}

export function createDesignTokenDocument(foundations) {
  const cssVariables = createDesignTokens(foundations)
  return {
    version: 1,
    tokens: Object.entries(cssVariables).map(([name, value]) => ({
      name,
      level: getDesignTokenLevel(name).toLowerCase(),
      type: getTokenType(name),
      value,
      reference: typeof value === 'string' ? value.match(/var\((--[^)]+)\)/)?.[1] ?? null : null,
    })),
  }
}
