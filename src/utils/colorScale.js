import { getBrandColor } from './brand.js'

// Convierte colores sRGB a OKLCH para crear tonos perceptualmente ordenados y asignar roles con contraste medible.
export const PRIMARY_TONE_NAMES = Object.freeze(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'])

const TONE_LIGHTNESS = Object.freeze({
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.76,
  400: 0.66,
  500: 0.56,
  600: 0.48,
  700: 0.4,
  800: 0.32,
  900: 0.24,
  950: 0.17,
})

const TONE_CHROMA_FACTOR = Object.freeze({
  50: 0.18,
  100: 0.32,
  200: 0.52,
  300: 0.72,
  400: 0.9,
  500: 1,
  600: 0.95,
  700: 0.82,
  800: 0.65,
  900: 0.45,
  950: 0.28,
})

export function normalizeHexColor(value) {
  const match = String(value ?? '').trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i)
  if (!match) return null
  const compact = match[1].length === 3
    ? [...match[1]].map(channel => channel.repeat(2)).join('')
    : match[1]
  return `#${compact.toUpperCase()}`
}

function hexToRgb(value) {
  const hex = normalizeHexColor(value)
  if (!hex) return null
  return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
}

function linearize(channel) {
  // Deshace la curva gamma de sRGB antes de operar con luminancia y coordenadas perceptuales.
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function encodeSrgb(channel) {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055
}

function rgbToHex(channels) {
  return `#${channels.map(channel => Math.round(Math.min(1, Math.max(0, channel)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

function srgbToOklch(value) {
  // Convierte sRGB lineal a OKLab y pasa de sus ejes a croma y ángulo para trabajar en OKLCH.
  const rgb = hexToRgb(value).map(linearize)
  const l = 0.4122214708 * rgb[0] + 0.5363325363 * rgb[1] + 0.0514459929 * rgb[2]
  const m = 0.2119034982 * rgb[0] + 0.6806995451 * rgb[1] + 0.1073969566 * rgb[2]
  const s = 0.0883024619 * rgb[0] + 0.2817188376 * rgb[1] + 0.6299787005 * rgb[2]
  const lRoot = Math.cbrt(l)
  const mRoot = Math.cbrt(m)
  const sRoot = Math.cbrt(s)
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot
  const chroma = Math.sqrt(a ** 2 + b ** 2)
  const hue = chroma < 0.0001 ? 0 : Math.atan2(b, a)
  return { lightness, chroma, hue }
}

export function getOklchLightness(value) {
  const normalized = normalizeHexColor(value)
  return normalized ? srgbToOklch(normalized).lightness : 0.56
}

function oklchToLinearSrgb(lightness, chroma, hue) {
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const lRoot = lightness + 0.3963377774 * a + 0.2158037573 * b
  const mRoot = lightness - 0.1055613458 * a - 0.0638541728 * b
  const sRoot = lightness - 0.0894841775 * a - 1.291485548 * b
  const l = lRoot ** 3
  const m = mRoot ** 3
  const s = sRoot ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function isInSrgbGamut(channels) {
  return channels.every(channel => channel >= -0.000001 && channel <= 1.000001)
}

function gamutMappedOklch(lightness, chroma, hue) {
  let resolvedChroma = chroma
  let channels = oklchToLinearSrgb(lightness, resolvedChroma, hue)
  if (!isInSrgbGamut(channels)) {
    // Conserva la luminosidad y el matiz pedidos reduciendo solo el croma hasta volver al rango visible sRGB.
    let low = 0
    let high = chroma
    for (let index = 0; index < 24; index += 1) {
      const candidate = (low + high) / 2
      const candidateChannels = oklchToLinearSrgb(lightness, candidate, hue)
      if (isInSrgbGamut(candidateChannels)) {
        low = candidate
        channels = candidateChannels
      } else {
        high = candidate
      }
    }
    resolvedChroma = low
  }
  return {
    hex: rgbToHex(channels.map(encodeSrgb)),
    chroma: resolvedChroma,
  }
}

export function getPrimaryColorScale(source) {
  const normalizedSource = normalizeHexColor(source) ?? getBrandColor()
  const origin = srgbToOklch(normalizedSource)
  return PRIMARY_TONE_NAMES.map(name => {
    const index = PRIMARY_TONE_NAMES.indexOf(name)
    const targetLightness = TONE_LIGHTNESS[name]
    const lightness = index < 5 && origin.lightness > TONE_LIGHTNESS['400']
      ? origin.lightness + ((5 - index) / 5) * (0.98 - origin.lightness)
      : index > 5 && origin.lightness < TONE_LIGHTNESS['600']
        ? origin.lightness - ((index - 5) / 5) * (origin.lightness - 0.02)
        : targetLightness
    const mapped = gamutMappedOklch(lightness, origin.chroma * TONE_CHROMA_FACTOR[name], origin.hue)
    return {
      name,
      token: `--color-primary-${name}`,
      // El tono 500 conserva exactamente el color de origen; elegir otro tono no regenera la paleta.
      hex: name === '500' ? normalizedSource : mapped.hex,
      lightness,
      chroma: name === '500' ? origin.chroma : mapped.chroma,
    }
  })
}

export function getRecommendedPrimaryTone(scale, source, background = '#FFFFFF', minimum = 4.5) {
  const sourceLightness = getOklchLightness(source)
  const candidates = scale.map(tone => {
    return { ...tone, ratio: getContrastRatio(tone.hex, background) }
  })
  const passingTones = candidates.filter(tone => tone.ratio >= minimum)
  // Si ningún tono alcanza el umbral, devuelve el más cercano al origen entre los disponibles.
  const eligible = passingTones.length ? passingTones : candidates
  return [...eligible].sort((first, second) => (
    Math.abs(first.lightness - sourceLightness) - Math.abs(second.lightness - sourceLightness)
    || second.ratio - first.ratio
  ))[0]
}

export function getRelativeLuminance(value) {
  const rgb = hexToRgb(value)
  if (!rgb) return 0
  const [red, green, blue] = rgb.map(linearize)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function getContrastRatio(first, second) {
  // Aplica la relación WCAG entre luminancias relativas; 4.5:1 es el umbral AA usado para texto normal.
  const firstLuminance = getRelativeLuminance(first)
  const secondLuminance = getRelativeLuminance(second)
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05)
}

export function getContrastLabel(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'No cumple AA'
}

export function getAccessibleTextColor(background) {
  // Compara blanco y negro y devuelve la opción con mayor contraste para el fondo indicado.
  const whiteRatio = getContrastRatio(background, '#FFFFFF')
  const blackRatio = getContrastRatio(background, '#000000')
  return blackRatio >= whiteRatio
    ? { hex: '#000000', name: 'black', ratio: blackRatio }
    : { hex: '#FFFFFF', name: 'white', ratio: whiteRatio }
}

function findTone(scale, name) {
  return scale.find(tone => tone.name === String(name)) ?? scale[0]
}

function chooseTone(scale, background, minimum, candidates) {
  return candidates
    .map(name => findTone(scale, name))
    .find(tone => getContrastRatio(tone.hex, background) >= minimum)
    ?? candidates.map(name => findTone(scale, name)).sort((first, second) => (
      getContrastRatio(second.hex, background) - getContrastRatio(first.hex, background)
    ))[0]
}

function toneAtOffset(scale, index, offset, fallback) {
  const target = Math.max(0, Math.min(scale.length - 1, index + offset))
  return scale[target] ?? fallback
}

export function getPrimaryColorRoles(scale, colors = {}, primaryTone = 'auto') {
  const surface = normalizeHexColor(colors.surface) ?? '#FFFFFF'
  const darkSurface = getRelativeLuminance(surface) < 0.22
  const actionCandidates = darkSurface
    ? ['400', '300', '500', '200', '600', '100', '700', '50', '800', '900', '950']
    : ['600', '700', '800', '900', '950', '500', '400', '300', '200', '100', '50']
  const action = chooseTone(scale, surface, 3, actionCandidates)
  const actionIndex = scale.findIndex(tone => tone.name === action.name)
  const hover = toneAtOffset(scale, actionIndex, darkSurface ? -1 : 1, action)
  const active = toneAtOffset(scale, actionIndex, darkSurface ? -2 : 2, hover)
  const link = chooseTone(scale, surface, 4.5, darkSurface
    ? ['300', '200', '400', '100', '500', '50', '600', '700', '800', '900', '950']
    : ['700', '800', '900', '950', '600', '500', '400', '300', '200', '100', '50'])
  const linkIndex = scale.findIndex(tone => tone.name === link.name)
  const linkHover = toneAtOffset(scale, linkIndex, darkSurface ? -1 : 1, link)
  const soft = findTone(scale, darkSurface ? '900' : '100')
  const softHover = findTone(scale, darkSurface ? '800' : '200')
  const softText = chooseTone(scale, soft.hex, 4.5, darkSurface
    ? ['200', '100', '300', '50', '400', '500', '600', '700', '800', '900', '950']
    : ['800', '900', '950', '700', '600', '500', '400', '300', '200', '100', '50'])
  const focus = chooseTone(scale, surface, 3, actionCandidates)

  const roles = {
    action: action.name,
    actionHover: hover.name,
    actionActive: active.name,
    actionText: getAccessibleTextColor(action.hex),
    actionHoverText: getAccessibleTextColor(hover.hex),
    actionActiveText: getAccessibleTextColor(active.hex),
    link: link.name,
    linkHover: linkHover.name,
    soft: soft.name,
    softHover: softHover.name,
    softText: softText.name,
    focus: focus.name,
  }

  const selectedToneIndex = scale.findIndex(tone => tone.name === String(primaryTone))
  if (selectedToneIndex < 0) return roles
  // La elección manual desplaza juntos los roles semánticos, manteniendo sus relaciones de tono.
  const offset = selectedToneIndex - actionIndex
  const shift = name => {
    const index = scale.findIndex(tone => tone.name === name)
    return scale[Math.max(0, Math.min(scale.length - 1, index + offset))]
  }
  const selectedAction = scale[selectedToneIndex]
  const selectedHover = shift(roles.actionHover)
  const selectedActive = shift(roles.actionActive)
  const selectedLink = shift(roles.link)
  const selectedLinkHover = shift(roles.linkHover)
  const selectedSoft = shift(roles.soft)
  const selectedSoftHover = shift(roles.softHover)
  const selectedSoftText = shift(roles.softText)
  const selectedFocus = shift(roles.focus)
  return {
    action: selectedAction.name,
    actionHover: selectedHover.name,
    actionActive: selectedActive.name,
    actionText: getAccessibleTextColor(selectedAction.hex),
    actionHoverText: getAccessibleTextColor(selectedHover.hex),
    actionActiveText: getAccessibleTextColor(selectedActive.hex),
    link: selectedLink.name,
    linkHover: selectedLinkHover.name,
    soft: selectedSoft.name,
    softHover: selectedSoftHover.name,
    softText: selectedSoftText.name,
    focus: selectedFocus.name,
  }
}
