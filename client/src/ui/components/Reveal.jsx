import { useEffect, useRef, useState } from "react"

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return true
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

export default function Reveal({
  className = "",
  children,
  delayMs = 0,
  once = true,
  y = 12,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  ...props
}) {
  const ref = useRef(null)
  const [reduceMotion] = useState(() => prefersReducedMotion())
  const [visible, setVisible] = useState(() => reduceMotion)

  useEffect(() => {
    if (reduceMotion) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, reduceMotion, rootMargin, threshold])

  const styles = [
    "will-change-transform transition-[opacity,transform] duration-700",
    visible ? "opacity-100" : "opacity-0",
    className
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      ref={ref}
      className={styles}
      style={{
        transitionDelay: `${delayMs}ms`,
        transform: `translateY(${visible ? 0 : y}px)`,
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
