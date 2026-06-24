import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

export const usePageMotion = (rootRef, setup) => {
  let media

  onMounted(() => {
    if (!rootRef.value) return

    media = gsap.matchMedia()
    media.add(
      { reduceMotion: '(prefers-reduced-motion: reduce)' },
      (context) => setup({ gsap, root: rootRef.value, reduceMotion: context.conditions.reduceMotion }),
      rootRef.value,
    )
  })

  onUnmounted(() => {
    media?.revert()
  })
}
