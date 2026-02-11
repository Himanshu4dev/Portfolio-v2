"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Services from "@/components/services"
import Process from "@/components/process"
import Contact from "@/components/contact"
import Testimonials from "@/components/testimonials"
import CursorGlow from "@/components/cursor-glow"
import { useGsapScrollAnimations } from "@/hooks/useGsapScrollAnimations"

export default function Home() {
  useGsapScrollAnimations()
  return (
    <main className="relative overflow-hidden">
      <CursorGlow />
      <Header />
      <Hero />
      <About />
      <Skills />
      <Services />
      <Projects />
      <Process />
      <Contact />
      <Testimonials />
    </main>
  )
}
