export default function Skills() {
  const skills = {
    "Product UI/UX": [
      "User journeys & flows",
      "Wireframes & high‑fidelity UI",
      "Design systems & components",
      "Interaction & micro‑animations",
      "Design handoff for engineering",
    ],
    "React & Frontend": [
      "React & Next.js",
      "TypeScript & modern patterns",
      "Tailwind CSS & design tokens",
      "API integration & state management",
      "Performance & accessibility",
    ],
    "Video & Motion": [
      "Adobe Premiere Pro",
      "DaVinci Resolve",
      "After Effects & motion graphics",
      "Color grading & audio polish",
      "Short‑form reels & ad creatives",
    ],
  }

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          data-animate="heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-6 sm:mb-8 md:mb-12 text-foreground tracking-tight"
        >
          Craft across design, code & video
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              data-animate="card"
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-8 hover-lift glow-hover transform transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(44,44,44,0.1)]"
            >
              <h3
                data-animate="heading"
                className="text-lg sm:text-xl md:text-2xl font-black font-display mb-4 sm:mb-5 md:mb-6 text-foreground"
              >
                {category}
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                {items.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg text-foreground/90">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
