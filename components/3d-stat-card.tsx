"use client"

import { useEffect, useRef, useState } from "react"

interface StatCard3DProps {
  label: string
  value: string
}

export default function StatCard3D({ label, value }: StatCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setRotation({
        x: y * 10,
        y: x * 10,
      })
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener("mousemove", handleMouseMove)
      return () => card.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      className="bg-gradient-to-br from-card/50 to-card/30 border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
    >
      <div className="text-3xl font-bold text-gradient mb-2">{value}</div>
      <div className="text-sm text-foreground/60">{label}</div>
    </div>
  )
}
