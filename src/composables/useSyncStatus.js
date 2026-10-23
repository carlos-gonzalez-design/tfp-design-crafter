import { onScopeDispose, ref, watch } from 'vue'

export function useSyncStatus(source, delay = 800) {
  const syncing = ref(false)
  let timer

  watch(source, () => {
    syncing.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { syncing.value = false }, delay)
  }, { deep: true, flush: 'sync' })

  onScopeDispose(() => window.clearTimeout(timer))
  return { syncing }
}
