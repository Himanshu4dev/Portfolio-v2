"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Floating3DText from "./floating-3d-text"

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
    <section className="hero-background min-h-screen flex items-center justify-center pt-24 md:pt-28 px-6 relative overflow-hidden">
      <div className="hero-orb orb-primary" />
      <div className="hero-orb orb-accent" />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        <div className="mb-8 inline-block" data-animate="card">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover-lift shadow-[0_0_40px_rgba(44,44,44,0.3)] overflow-hidden p-1">
            <Image 
              src="/logo.jpeg" 
              alt="Logo" 
              width={112} 
              height={112} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <Floating3DText />

        <p
          data-animate="heading"
          className="text-base sm:text-lg md:text-xl text-foreground/80 mb-3 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          UI/UX & React Frontend Developer · Video Editor
        </p>
        <p className="text-sm sm:text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          I design and build clean, production-ready interfaces in React/Next.js and craft cinematic edits for brands,
          creators, and products that need to feel premium.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate="card">
          <button
            onClick={() => router.push("/work")}
            className="px-8 py-4 rounded-full font-semibold hover-lift btn-dark"
          >
            View design & video work
          </button>
          <button
            onClick={() => router.push("#contact")}
            className="px-8 py-4 rounded-full font-semibold hover-lift bg-card border border-border text-foreground"
          >
            Book a project call
          </button>
        </div>
      </div>
    </section>
  )
}
