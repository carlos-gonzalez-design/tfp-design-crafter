const BRAND_FALLBACK = '#635BFF'

// Lee el color de marca definido en CSS y ofrece un valor estable cuando se ejecuta fuera del navegador.
export function getBrandColor() {
  if (typeof document === 'undefined') return BRAND_FALLBACK
  return getComputedStyle(document.documentElement).getPropertyValue('--dc-color-brand').trim().toUpperCase() || BRAND_FALLBACK
}
