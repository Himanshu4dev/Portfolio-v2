"use client"

import { useEffect, useRef } from "react"
import Floating3DText from "./floating-3d-text"

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return

      const rect = textRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI)

      textRef.current.style.setProperty("--rotation", `${angle}deg`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="hero-background min-h-screen flex items-center justify-center pt-20 px-6 relative">
      <div className="hero-orb orb-primary" />
      <div className="hero-orb orb-accent" />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover-lift">
            <span className="text-3xl font-bold text-primary-foreground">HV</span>
          </div>
        </div>

        <Floating3DText />

        <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Video Editor & Web Developer crafting premium digital experiences with precision and creativity
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift glow-hover">
            View My Work
          </button>
          <button className="px-8 py-4 border border-primary text-primary rounded-lg font-semibold hover-lift hover:bg-primary/10">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  )
}
