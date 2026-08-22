import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 -> target once `start` becomes true.
 * Returns the current display value (already rounded to `decimals`).
 */
export function useCountUp(target, start, { duration = 1600, decimals = 0 } = {}) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()
    const from = 0

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = from + (target - from) * eased
      setValue(Number(current.toFixed(decimals)))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [start, target, duration, decimals])

  return value
}
