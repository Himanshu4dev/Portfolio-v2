"use client"

import Link from "next/link"

const includes = [
  "Viral editing style systems",
  "Cinematic + SaaS motion workflows",
  "Client acquisition playbook",
  "Lifetime updates to your process",
  "Fast feedback and iteration loops",
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto section-shell p-6 sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground/90 mb-2">Pricing</p>
            <h2 data-animate="heading" className="section-title text-3xl sm:text-4xl md:text-5xl font-black font-display">
              Pay once, build forever
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              One-time investment for a complete design + development + editing execution system.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 bg-card/80">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Limited Slots</span>
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        <article data-animate="card" className="modern-card p-5 sm:p-8 md:p-10 ue-spotlight card-hover">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/90 mb-2">Lifetime Access</p>
              <h3 className="text-2xl sm:text-3xl font-black font-display mb-3">Ultimate Creative System</h3>
              <p className="text-muted-foreground mb-6">
                Designed for founders, creators, and brands that want premium UI and video assets without agency bloat.
              </p>
              <div className="flex flex-wrap items-end gap-2 mb-6">
                <span className="text-3xl sm:text-5xl font-black">$497</span>
                <span className="text-sm text-muted-foreground pb-1">one-time</span>
              </div>
              <Link href="#contact" className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-3 rounded-full btn-dark font-semibold">
                Get Access
              </Link>
            </div>

            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 hover:border-primary/60 transition-all duration-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm sm:text-base text-foreground/95">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  )
}

