"use client"

import { useEffect, useRef, useState } from "react"

export default function Floating3DText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setRotation({
        x: y * 25,
        y: x * 25,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-96 flex items-center justify-center perspective">
      <div
        ref={textRef}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) perspective(1000px)`,
          transition: "transform 0.1s ease-out",
        }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-display mb-6 leading-tight">
          <span className="block text-gradient mb-2" style={{ textShadow: "0 0 30px rgba(167, 107, 207, 0.3)" }}>
            Himanshu
          </span>
          <span className="block text-foreground" style={{ textShadow: "0 0 30px rgba(233, 127, 23, 0.3)" }}>
            Virell
          </span>
        </h1>
      </div>
    </div>
  )
}
