const BRAND_FALLBACK = '#635BFF'

export function getBrandColor() {
  if (typeof document === 'undefined') return BRAND_FALLBACK
  return getComputedStyle(document.documentElement).getPropertyValue('--dc-color-brand').trim().toUpperCase() || BRAND_FALLBACK
}
