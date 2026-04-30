"use client"

import { useEffect, useRef, useState } from "react"

export default function Floating3DText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    // Skip global mouse tracking on touch devices / reduced motion;
    // text will still look premium due to chrome styling.
    if (prefersReduced || isMobile) {
      return
    }

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
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[14rem] sm:min-h-[16rem] md:min-h-96 flex items-center justify-center perspective"
    >
      <div
        ref={textRef}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) perspective(1000px)`,
          transition: "transform 0.1s ease-out",
        }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-display mb-5 sm:mb-6 leading-tight tracking-tight">
          <span 
            className="block text-chrome mb-2"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 30%, #93c5fd 65%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 12px rgba(37, 99, 235, 0.28), 0 2px 18px rgba(124, 58, 237, 0.2)",
              filter: "drop-shadow(0 2px 10px rgba(37, 99, 235, 0.24))",
              position: "relative",
            }}
          >
            Himanshu
          </span>
          <span 
            className="block text-chrome font-black"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 30%, #93c5fd 65%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 12px rgba(37, 99, 235, 0.28), 0 2px 18px rgba(124, 58, 237, 0.2)",
              filter: "drop-shadow(0 2px 10px rgba(37, 99, 235, 0.24))",
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
