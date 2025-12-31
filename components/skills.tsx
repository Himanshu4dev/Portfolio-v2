export default function Skills() {
  const skills = {
    "Video Editing": ["Adobe Premiere Pro", "DaVinci Resolve", "After Effects", "Motion Graphics", "Color Grading"],
    "Web Development": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    Design: ["Figma", "UI/UX Design", "Branding", "Prototyping", "Animation"],
  }

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          data-animate="heading"
          className="text-4xl md:text-5xl font-black font-display mb-12 text-foreground tracking-tight"
        >
          Skills & Expertise
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} data-animate="card" className="bg-card border border-border rounded-lg p-8 hover-lift glow-hover transform transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(44,44,44,0.1)]">
              <h3 data-animate="heading" className="text-2xl font-black font-display mb-6 text-foreground">{category}</h3>
              <ul className="space-y-3">
                {items.map((skill) => (
                  <li key={skill} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{skill}</span>
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
