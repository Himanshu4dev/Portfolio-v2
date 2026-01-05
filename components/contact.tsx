"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isFormValid = formData.name && formData.email && formData.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message")
      }
      setIsSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 3000)
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2
          data-animate="heading"
          className="text-4xl md:text-5xl font-black font-display mb-4 text-foreground text-center tracking-tight"
        >
          Let's Create Something Amazing
        </h2>
        <p className="text-center text-foreground mb-6 text-lg">
          Have a project in mind? Let's collaborate and bring your vision to life.
        </p>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" data-animate="card">
          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-foreground">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 resize-none transition-all duration-300"
              rows={5}
              placeholder="Tell me about your project..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`w-full px-8 py-4 rounded-lg font-black transition-all duration-500 ${
              isSubmitted
                ? "bg-accent text-accent-foreground scale-105 shadow-[0_0_30px_rgba(74,74,74,0.3)]"
                : isSubmitting
                  ? "btn-dark opacity-80 scale-95"
                  : isFormValid
                    ? "btn-dark hover-lift hover:scale-105"
                    : "btn-dark opacity-40 text-white/60 cursor-not-allowed"
            }`}
          >
            {isSubmitted ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">✓ Message Sent Successfully!</span>
            ) : isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        <div className="mt-16 pt-12 border-t border-border text-center">
          <p className="text-foreground mb-6">Connect with me on social media</p>
          <div className="flex justify-center gap-6">
            {["GitHub", "LinkedIn", "Twitter", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-foreground hover:text-primary transition-all duration-300 font-semibold hover-lift"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
