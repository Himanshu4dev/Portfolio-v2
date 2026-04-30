"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Floating3DText from "./floating-3d-text"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="hero-background min-h-screen flex items-center justify-center pt-24 md:pt-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="hero-orb orb-primary" />
      <div className="hero-orb orb-accent" />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full section-shell px-4 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
        <div className="mb-6 sm:mb-8 inline-block" data-animate="card">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover-lift shadow-[0_0_40px_rgba(31,41,55,0.24)] overflow-hidden p-1">
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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center" data-animate="card">
          <button
            onClick={() => router.push("/work")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold hover-lift btn-dark shadow-lg"
          >
            View design & video work
          </button>
          <Link
            href="#contact"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold hover-lift bg-card border border-border text-foreground inline-flex justify-center hover:bg-muted"
          >
            Book a project call
          </Link>
        </div>
      </div>
    </section>
  )
}
