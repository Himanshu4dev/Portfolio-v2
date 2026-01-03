"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Download, Menu, X } from "lucide-react"
import gsap from "gsap"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const navLinksRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Entrance animation on mount
  useEffect(() => {
    const header = headerRef.current
    const logo = logoRef.current
    const navLinks = navLinksRef.current
    const buttons = buttonsRef.current

    if (!header || !logo || !navLinks || !buttons) return

    // Set initial states
    gsap.set(header, { y: -100, opacity: 0 })
    gsap.set(logo, { opacity: 0, scale: 0.8 })
    gsap.set(navLinks.children, { opacity: 0, y: -20 })
    gsap.set(buttons.children, { opacity: 0, x: 20 })

    // Animate header entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    
    tl.to(header, {
      y: 0,
      opacity: 1,
      duration: 0.8,
    })
      .to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
      }, "-=0.4")
      .to(navLinks.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
      }, "-=0.3")
      .to(buttons.children, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
      }, "-=0.4")
  }, [])

  // Scroll-based animations
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)

      const header = headerRef.current
      if (!header) return

      // Smooth background transition
      if (scrolled) {
        gsap.to(header, {
          backgroundColor: "rgba(239, 233, 224, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottomWidth: "1px",
          boxShadow: "0 10px 30px rgba(44, 44, 44, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        gsap.to(header, {
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          borderBottomWidth: "0px",
          boxShadow: "0 0 0 rgba(44, 44, 44, 0)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu animation
  useEffect(() => {
    const mobileMenu = mobileMenuRef.current
    if (!mobileMenu) return

    if (isMenuOpen) {
      // Set initial state
      gsap.set(mobileMenu, { display: "block", height: 0, opacity: 0 })
      
      // Get the natural height
      const height = mobileMenu.scrollHeight

      gsap.to(mobileMenu, {
        height: height,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      })

      const menuContent = mobileMenu.querySelector("div")
      if (menuContent) {
        gsap.fromTo(
          menuContent.children,
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
            delay: 0.1,
            ease: "power2.out",
          }
        )
      }
    } else {
      gsap.to(mobileMenu, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(mobileMenu, { display: "none" })
        },
      })
    }
  }, [isMenuOpen])

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

  // Enhanced hover animations for nav links
  const handleNavLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    const link = e.currentTarget
    const underline = link.querySelector("span")
    
    if (isEntering) {
      gsap.to(link, {
        y: -2,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(underline, {
        width: "100%",
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(link, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(underline, {
        width: "0%",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  // Enhanced hover animations for logo
  const handleLogoHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    const logo = e.currentTarget
    const underline = logo.querySelector("span")
    
    if (isEntering) {
      gsap.to(logo, {
        scale: 1.1,
        rotation: 2,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      gsap.to(underline, {
        width: "100%",
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(logo, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      gsap.to(underline, {
        width: "0%",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  // Enhanced button hover animations
  const handleButtonHover = (e: React.MouseEvent<HTMLElement>, isEntering: boolean) => {
    const button = e.currentTarget
    
    if (isEntering) {
      gsap.to(button, {
        scale: 1.05,
        y: -2,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    } else {
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 w-full z-50 ${
        isScrolled
          ? "border-b border-primary/20"
          : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          ref={logoRef}
          href="#"
          className="text-2xl font-black font-display text-foreground relative group cursor-pointer"
          onMouseEnter={(e) => handleLogoHover(e, true)}
          onMouseLeave={(e) => handleLogoHover(e, false)}
        >
          HV
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary" />
        </Link>

        <div ref={navLinksRef} className="hidden md:flex gap-8 items-center">
          {["About", "Skills", "Projects", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold text-foreground hover:text-primary relative group cursor-pointer"
              onMouseEnter={(e) => handleNavLinkHover(e, true)}
              onMouseLeave={(e) => handleNavLinkHover(e, false)}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary" />
            </Link>
          ))}
        </div>

        <div ref={buttonsRef} className="hidden md:flex gap-4 items-center">
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-full text-sm font-semibold hover:bg-accent/20 hover:border-accent/50 cursor-pointer"
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            <Download size={16} />
            Resume
          </button>

          <a
            href="https://wa.me/7235933039"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 cursor-pointer"
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            Let's Connect
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:text-primary hover:bg-foreground/5 transition-all duration-300 cursor-pointer"
          onClick={() => setIsMenuOpen((o) => !o)}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.1,
              rotation: isMenuOpen ? 90 : 0,
              duration: 0.3,
              ease: "back.out(1.7)",
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            })
          }}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden border-t border-primary/20 bg-background/90 backdrop-blur-xl overflow-hidden"
        style={{ display: "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
          <div className="grid gap-2">
            {["About", "Skills", "Projects", "Contact"].map((item, index) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    x: 10,
                    duration: 0.2,
                    ease: "power2.out",
                  })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    x: 0,
                    duration: 0.2,
                    ease: "power2.out",
                  })
                }}
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-full text-sm font-semibold hover:bg-accent/20 hover:border-accent/50 cursor-pointer"
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <Download size={16} />
              Resume
            </button>
            <a
              href="https://wa.me/7235933039"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 cursor-pointer"
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              Let's Connect
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
