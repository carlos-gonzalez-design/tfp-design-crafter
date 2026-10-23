import { onScopeDispose, ref, watch } from 'vue'

// Expone un indicador breve de sincronización cada vez que cambia profundamente una foundation.
export function useSyncStatus(source, delay = 800) {
  const syncing = ref(false)
  let timer

  watch(source, () => {
    syncing.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { syncing.value = false }, delay)
  }, { deep: true, flush: 'sync' })

  // Cancela el temporizador al desmontar el ámbito para no dejar callbacks pendientes.
  onScopeDispose(() => window.clearTimeout(timer))
  return { syncing }
}
