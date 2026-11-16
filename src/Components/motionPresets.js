export const ease = [0.22, 1, 0.36, 1]

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: gap, delayChildren: delay } },
})

export const rise = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease } },
}

export const slideIn = (x = -32) => ({
  hidden: { x, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.65, ease } },
})

export const pop = {
  hidden: { scale: 0.7, opacity: 0, y: 8 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

export const growLine = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease, delay: 0.2 } },
}

export const float = (distance = 10, duration = 5) => ({
  animate: { y: [0, -distance, 0], transition: { duration, ease: 'easeInOut', repeat: Infinity } },
})
