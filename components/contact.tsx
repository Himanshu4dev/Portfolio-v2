"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isFormValid = formData.name && formData.email && formData.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted:", formData)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", message: "" })

    // Reset submitted state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gradient text-center">
          Let's Create Something Amazing
        </h2>
        <p className="text-center text-foreground/70 mb-12 text-lg">
          Have a project in mind? Let's collaborate and bring your vision to life.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={5}
              placeholder="Tell me about your project..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-500 ${
              isSubmitted
                ? "bg-accent text-accent-foreground scale-105"
                : isSubmitting
                  ? "bg-primary/70 text-primary-foreground scale-95"
                  : isFormValid
                    ? "bg-primary text-primary-foreground hover-lift glow-hover"
                    : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
            }`}
          >
            {isSubmitted ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">✓ Message Sent Successfully!</span>
            ) : isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        <div className="mt-16 pt-12 border-t border-border text-center">
          <p className="text-foreground/60 mb-6">Connect with me on social media</p>
          <div className="flex justify-center gap-6">
            {["GitHub", "LinkedIn", "Twitter", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-foreground/60 hover:text-primary transition-all duration-300 font-semibold hover-lift"
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
