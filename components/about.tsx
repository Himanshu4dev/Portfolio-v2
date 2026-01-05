"use client"

import { useEffect, useRef, useState } from "react"

interface Card3DProps {
  label: string
  value: string
}

function AboutCard3D({ label, value }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)")

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * 15
      const rotateY = ((centerX - x) / centerX) * 15

      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`)
    }

    const handleMouseLeave = () => {
      setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)")
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        transform: transform,
        transition: "transform 0.1s ease-out",
      }}
      data-animate="card"
      className="relative p-4 sm:p-5 md:p-6 rounded-xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <p className="text-xs sm:text-sm md:text-base font-medium text-foreground/60 mb-2 sm:mb-3">{label}</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-card/10">
      <div className="max-w-6xl mx-auto">
        <h2
          data-animate="heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-6 sm:mb-8 md:mb-12 text-foreground tracking-tight"
        >
          About Me
        </h2>
        <div data-animate="card" className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl text-foreground mb-4 sm:mb-5 leading-relaxed font-medium">
            I believe in the power of combining creative vision with technical excellence. Every project I undertake
            is an opportunity to push boundaries and deliver exceptional results that exceed expectations.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed font-medium">
            When I'm not creating, you'll find me exploring new design trends, experimenting with emerging
            technologies, or collaborating with talented creators to bring ambitious ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
          {[
            { label: "Projects Completed", value: "50+" },
            { label: "Years Experience", value: "5+" },
            { label: "Happy Clients", value: "40+" },
            { label: "Awards Won", value: "12" },
          ].map((stat) => (
            <AboutCard3D key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </section>
  )
}
