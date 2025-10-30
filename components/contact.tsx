"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
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
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift glow-hover"
          >
            Send Message
          </button>
        </form>

        <div className="mt-16 pt-12 border-t border-border text-center">
          <p className="text-foreground/60 mb-6">Connect with me on social media</p>
          <div className="flex justify-center gap-6">
            {["GitHub", "LinkedIn", "Twitter", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors font-semibold"
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
