"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useGsapScrollAnimations({
  headingSelector = "[data-animate='heading']",
  cardSelector = "[data-animate='card']",
} = {}) {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // If user prefers reduced motion, keep everything visible but don't animate
    if (prefersReduced) {
      const headings = gsap.utils.toArray<HTMLElement>(headingSelector)
      const cards = gsap.utils.toArray<HTMLElement>(cardSelector)

      headings.forEach((heading) => {
        gsap.set(heading, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "none",
        })
      })

      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "none",
        })
      })

      return
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    // Enhanced heading animations with scale and blur effects
    const headings = gsap.utils.toArray<HTMLElement>(headingSelector)
    const headingTweens = headings.map((heading) => {
      return gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: isMobile ? 30 : 50,
          scale: 0.96,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Enhanced card animations with 3D effects
    const cards = gsap.utils.toArray<HTMLElement>(cardSelector)
    const cardTweens = cards.map((card, index) =>
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: isMobile ? 40 : 80,
          rotateX: isMobile ? -5 : -10,
          rotateY: isMobile ? 0 : -4,
          scale: 0.94,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          delay: index * 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      ),
    )

    // Add parallax effect to hero section
    const hero = document.querySelector(".hero-background")
    if (hero && !isMobile) {
      gsap.to(hero, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }

    // Animate hero orbs
    const orbs = document.querySelectorAll(".hero-orb")
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        scale: 1.2,
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: i * 0.5,
      })
    })

    return () => {
      headingTweens.forEach((tween) => tween.scrollTrigger?.kill())
      cardTweens.forEach((tween) => tween.scrollTrigger?.kill())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [headingSelector, cardSelector])
}