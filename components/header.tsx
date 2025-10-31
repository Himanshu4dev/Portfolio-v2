"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDownloadResume = () => {
    const resumeUrl = "/resume.pdf"
    const link = document.createElement("a")
    link.href = resumeUrl
    link.download = "Himanshu-Virell-Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="#" className="text-2xl font-bold font-display text-gradient hover-lift relative group">
          HV
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {["About", "Skills", "Projects", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-full text-sm font-semibold hover:bg-accent/20 hover:border-accent/50 transition-all duration-300 hover-lift"
          >
            <Download size={16} />
            Resume
          </button>

          <button className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
            Let's Talk
          </button>
        </div>
      </nav>
    </header>
  )
}
