import typographyStyles from '../styles/design-system/ds-typography.css?inline'
import actionStyles from '../styles/design-system/ds-actions.css?inline'
import formStyles from '../styles/design-system/ds-forms.css?inline'
import cardStyles from '../styles/design-system/ds-cards.css?inline'
import navigationStyles from '../styles/design-system/ds-navigation.css?inline'
import feedbackStyles from '../styles/design-system/ds-feedback.css?inline'
import exampleStyles from '../styles/preview/preview-examples.css?inline'
import playgroundStyles from '../styles/preview/playground.css?inline'
import { getDesignTokenLevel } from './designTokens.js'

// Construye hojas CSS de tokens o una versión completa con estilos de componentes y adaptación de tema oscuro.
const componentStyles = [typographyStyles, actionStyles, formStyles, cardStyles, navigationStyles, feedbackStyles, exampleStyles, playgroundStyles]

export function normalizeStylesheetName(value = '') {
  // Normaliza el nombre para usarlo de forma segura y consistente en ambos archivos descargados.
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\.css$/i, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return normalized || 'design-crafter'
}

export function getStylesheetFilenames(value = '') {
  const baseName = normalizeStylesheetName(value)
  return {
    tokens: `${baseName}-tokens.css`,
    complete: `${baseName}-complete.css`,
  }
}

function formatValue(value, unit) {
  // Solo convierte medidas en px; los valores no dimensionales y referencias CSS quedan intactos.
  if (unit === 'px') return value
  return String(value).replace(/(-?\d*\.?\d+)px\b/g, (_, pixels) => {
    const rem = Number(pixels) / 16
    return `${Number(rem.toFixed(4))}rem`
  })
}

export function generateCssExport({ variables, type, theme = 'light', unit = 'rem', includeComments = true, projectName = 'Design system' }) {
  const comment = text => includeComments ? `/* ${text} */\n` : ''
  const metadataName = projectName.replace(/\*\//g, '* /')
  const tokens = Object.entries(variables)
  const primitiveTokens = tokens.filter(([name]) => getDesignTokenLevel(name) === 'Primitive')
  // Separa los valores base de sus alias para que el CSS exportado conserve la jerarquía del sistema.
  const semanticTokens = tokens.filter(([name]) => getDesignTokenLevel(name) !== 'Primitive')
  const declarations = entries => entries
    .map(([name, value]) => `  ${name}: ${formatValue(value, unit)};`)
    .join('\n')
  const sections = [
    comment(`${metadataName} · Design Crafter CSS export · generated from current Foundations · ${theme} theme · ${unit}`),
    comment('1. Foundation variables'),
    `:root {\n${declarations(primitiveTokens)}\n}`,
    comment('2. Semantic and component tokens'),
    `:root {\n${declarations(semanticTokens)}\n}`,
  ]

  if (type === 'complete') {
    sections.push(
      comment('3. Base styles'),
      `*, *::before, *::after { box-sizing: border-box; }\n.ds-theme { color: var(--ds-color-text-primary-default); background: var(--ds-color-bg-canvas-default); font-family: var(--ds-font-family); }`,
      comment('4. BEM component styles'),
      ...componentStyles,
      comment('5. Component variants and interaction states are included in the BEM rules above'),
      comment('6. Dark mode semantic adaptation'),
    )
    sections.push(
      // Los aliases semánticos se sobreescriben para ambos disparadores de modo oscuro que usa la aplicación.
      `@media (prefers-color-scheme: dark) {\n  :root, .ds-theme--dark {\n    --color-neutral-background: #111113;\n    --color-neutral-surface: #19191c;\n    --color-neutral-text: #f5f5f5;\n    --color-neutral-border: color-mix(in srgb, #f5f5f5 18%, #19191c);\n    --ds-color-background: var(--color-neutral-background);\n    --ds-color-surface: var(--color-neutral-surface);\n    --ds-color-text: var(--color-neutral-text);\n    --ds-color-text-primary-default: var(--color-neutral-text);\n    --ds-color-text-secondary-default: #a1a1aa;\n    --ds-color-border: var(--color-neutral-border);\n  }\n}\n.dc-theme--dark {\n  --color-neutral-background: #111113;\n  --color-neutral-surface: #19191c;\n  --color-neutral-text: #f5f5f5;\n  --color-neutral-border: color-mix(in srgb, #f5f5f5 18%, #19191c);\n  --ds-color-background: var(--color-neutral-background);\n  --ds-color-surface: var(--color-neutral-surface);\n  --ds-color-text: var(--color-neutral-text);\n  --ds-color-text-primary-default: var(--color-neutral-text);\n  --ds-color-text-secondary-default: #a1a1aa;\n  --ds-color-border: var(--color-neutral-border);\n}`,
    )
  }

  return sections.filter(Boolean).join('\n\n').trim() + '\n'
}
