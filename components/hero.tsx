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
    <section className="hero-background min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      <div className="hero-orb orb-primary" />
      <div className="hero-orb orb-accent" />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <div className="mb-8 inline-block" data-animate="card">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover-lift shadow-[0_0_40px_rgba(44,44,44,0.3)]">
            <span className="text-3xl font-black text-primary-foreground">HV</span>
          </div>
        </div>

        <Floating3DText />

        <p 
          data-animate="heading"
          className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Video Editor & Web Developer crafting premium digital experiences with precision and creativity
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate="card">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover-lift glow-hover transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(44,44,44,0.3)]">
            View My Work
          </button>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover-lift hover:bg-primary/10 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(44,44,44,0.2)]">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  )
}
