<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type AnimationType
  = 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'blur-up'

const props = withDefaults(defineProps<{
  as?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}>(), {
  as: 'div',
  animation: 'fade-up',
  delay: 0,
  duration: 600,
  threshold: 0.25,
  once: true
})

const element = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const prefersReducedMotion = computed(() =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
)

const style = computed(() => ({
  transitionDelay: `${props.delay}ms`,
  transitionDuration: `${props.duration}ms`
}))

onMounted(() => {
  if (!element.value) {
    return
  }

  if (!('IntersectionObserver' in window) || prefersReducedMotion.value) {
    element.value.classList.add('is-visible')
    return
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        if (props.once && observer) {
          observer.unobserve(entry.target)
        }
      } else if (!props.once) {
        entry.target.classList.remove('is-visible')
      }
    }
  }, {
    threshold: props.threshold
  })

  observer.observe(element.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <component :is="props.as" ref="element" class="scroll-reveal" :data-animation="props.animation" :style="style">
    <slot />
  </component>
</template>
