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
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-display mb-6 leading-tight tracking-tight">
          <span 
            className="block text-chrome mb-2"
            style={{
              background: "linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 25%, #6b6b6b 50%, #8a8a8a 75%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
              position: "relative",
            }}
          >
            Himanshu
          </span>
          <span 
            className="block text-chrome font-black"
            style={{
              background: "linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 25%, #6b6b6b 50%, #8a8a8a 75%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
              position: "relative",
            }}
          >
            Virell
          </span>
        </h1>
      </div>
    </div>
  )
}
