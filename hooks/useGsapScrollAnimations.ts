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
    // Enhanced heading animations with scale and blur effects
    const headings = gsap.utils.toArray<HTMLElement>(headingSelector)
    const headingTweens = headings.map((heading) => {
      return gsap.fromTo(
        heading,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          filter: "blur(10px)",
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
          y: 100,
          rotateX: -15,
          rotateY: -5,
          scale: 0.85,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          delay: index * 0.1,
          ease: "power3.out",
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
    if (hero) {
      gsap.to(hero, {
        y: -100,
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