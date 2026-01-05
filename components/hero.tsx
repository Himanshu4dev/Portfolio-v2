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
    <section className="hero-background min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
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
          className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Video Editor & Web Developer crafting premium digital experiences with precision and creativity
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate="card">
          <button onClick={() => router.push('/work')} className="px-8 py-4 rounded-lg font-bold hover-lift transform transition-all duration-300 hover:opacity-95 hover:scale-105 btn-dark">
            View My Work
          </button>
          <button onClick={() => router.push('/contact')} className="px-8 py-4 rounded-lg font-bold hover-lift transform transition-all duration-300 hover:opacity-95 hover:scale-105 btn-dark">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  )
}
