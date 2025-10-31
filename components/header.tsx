"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Menu, X } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu if viewport becomes md and up
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
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

          <a
            href="https://wa.me/7235933039"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
          >
            Let's Connect
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-primary hover:bg-foreground/5 transition"
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-background/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <div className="grid gap-2">
              {["About", "Skills", "Projects", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 text-sm font-medium text-foreground/80 hover:text-primary transition"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  handleDownloadResume()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-full text-sm font-semibold hover:bg-accent/20 hover:border-accent/50 transition-all duration-300"
              >
                <Download size={16} />
                Resume
              </button>
              <a
                href="https://wa.me/7235933039"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                Let's Connect
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
