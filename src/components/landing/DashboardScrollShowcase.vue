<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { dashboardShowcaseFrames } from '../../data/dashboardShowcaseFrames.js'

const showcase = ref(null)
const props = defineProps({ theme: { type: String, required: true } })
const activeIndex = ref(0)
const progress = ref(0)
const viewportWidth = ref(typeof window === 'undefined' ? 0 : window.innerWidth)
const reducedMotion = ref(false)
let animationFrame = 0
let motionQuery

const isScrollDriven = computed(() => viewportWidth.value >= 768 && !reducedMotion.value)
const activeFrame = computed(() => dashboardShowcaseFrames[activeIndex.value])
const themedFrames = computed(() => dashboardShowcaseFrames.map(frame => ({
  ...frame,
  src: frame[`${props.theme}Src`],
})))
const progressPercent = computed(() => `${Math.round(progress.value * 10000) / 100}%`)

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function updateShowcase() {
  animationFrame = 0
  if (!showcase.value || !isScrollDriven.value) return

  const sectionTop = window.scrollY + showcase.value.getBoundingClientRect().top
  const scrollDistance = Math.max(showcase.value.offsetHeight - window.innerHeight, 1)
  progress.value = clamp((window.scrollY - sectionTop) / scrollDistance)
  activeIndex.value = Math.round(progress.value * (dashboardShowcaseFrames.length - 1))
}

function requestUpdate() {
  if (!animationFrame) animationFrame = window.requestAnimationFrame(updateShowcase)
}

function handleResize() {
  viewportWidth.value = window.innerWidth
  if (!isScrollDriven.value) progress.value = activeIndex.value / (dashboardShowcaseFrames.length - 1)
  requestUpdate()
}

function handleMotionPreference(event) {
  reducedMotion.value = event.matches
  if (!isScrollDriven.value) progress.value = activeIndex.value / (dashboardShowcaseFrames.length - 1)
  requestUpdate()
}

function selectFrame(index) {
  activeIndex.value = index
  progress.value = index / (dashboardShowcaseFrames.length - 1)

  if (!isScrollDriven.value || !showcase.value) return

  const sectionTop = window.scrollY + showcase.value.getBoundingClientRect().top
  const scrollDistance = Math.max(showcase.value.offsetHeight - window.innerHeight, 1)
  window.scrollTo({
    top: sectionTop + scrollDistance * progress.value,
    behavior: 'smooth',
  })
}

function handleControlKeydown(event, index) {
  const lastIndex = dashboardShowcaseFrames.length - 1
  let nextIndex

  if (['ArrowRight', 'ArrowDown'].includes(event.key)) nextIndex = Math.min(index + 1, lastIndex)
  if (['ArrowLeft', 'ArrowUp'].includes(event.key)) nextIndex = Math.max(index - 1, 0)
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = lastIndex
  if (nextIndex === undefined) return

  event.preventDefault()
  selectFrame(nextIndex)
  showcase.value?.querySelector(`[data-frame-control="${nextIndex}"]`)?.focus()
}

function frameStyle(index) {
  if (!isScrollDriven.value) {
    return {
      opacity: index === activeIndex.value ? 1 : 0,
      transform: index === activeIndex.value ? 'scale(1)' : 'scale(0.992)',
    }
  }

  const framePosition = progress.value * (dashboardShowcaseFrames.length - 1)
  const opacity = clamp(1 - Math.abs(framePosition - index) * 1.7)
  return {
    opacity,
    transform: `scale(${0.992 + opacity * 0.008})`,
  }
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  viewportWidth.value = window.innerWidth
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  motionQuery.addEventListener('change', handleMotionPreference)
  requestUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', handleResize)
  motionQuery?.removeEventListener('change', handleMotionPreference)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <section
    ref="showcase"
    class="dashboard-scroll-showcase"
    :class="{ 'dashboard-scroll-showcase--scroll-driven': isScrollDriven }"
    :style="{ '--showcase-progress': progressPercent }"
    aria-label="Design Crafter dashboard walkthrough"
  >
    <div class="dashboard-scroll-showcase__sticky">
      <figure class="dashboard-scroll-showcase__figure">
        <figcaption>
          <span>{{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(dashboardShowcaseFrames.length).padStart(2, '0') }}</span>
          <h2>{{ activeFrame.label }}</h2>
          <p>{{ activeFrame.description }}</p>
        </figcaption>
        <div class="dashboard-scroll-showcase__frame">
          <div class="dashboard-scroll-showcase__bar" aria-hidden="true">
            <span></span><span></span><span></span>
            <p>design-crafter / app</p>
            <i>Live</i>
          </div>
          <div class="dashboard-scroll-showcase__stage" :data-theme="props.theme">
            <img
              v-for="(frame, index) in themedFrames"
              :key="frame.id"
              :src="frame.src"
              :alt="frame.alt"
              width="1920"
              height="1200"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              :aria-hidden="index !== activeIndex"
              :data-active="index === activeIndex ? 'true' : 'false'"
              :style="frameStyle(index)"
            />
          </div>
        </div>

      </figure>

      <nav class="dashboard-scroll-showcase__controls" aria-label="Dashboard views">
        <ol>
          <li v-for="(frame, index) in dashboardShowcaseFrames" :key="frame.id">
            <button
              type="button"
              :aria-current="index === activeIndex ? 'step' : undefined"
              :aria-label="`Show ${frame.label} dashboard view`"
              :data-frame-control="index"
              @click="selectFrame(index)"
              @keydown="handleControlKeydown($event, index)"
            >
              <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ frame.label }}
            </button>
          </li>
        </ol>
        <div class="dashboard-scroll-showcase__progress" aria-hidden="true"><span></span></div>
        <p v-if="isScrollDriven">Scroll to explore</p>
        <p v-else>Choose a view</p>
      </nav>
    </div>
  </section>
</template>
