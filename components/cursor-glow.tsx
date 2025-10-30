"use client"

import { useEffect, useRef } from "react"

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      if (cursorRef.current) {
        // Smooth follow effect
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.2
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.2

        cursorRef.current.style.left = cursorPos.current.x + "px"
        cursorRef.current.style.top = cursorPos.current.y + "px"
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-glow" />
}
