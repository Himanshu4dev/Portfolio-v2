export default function Skills() {
  const skills = {
    "Video Editing": ["Adobe Premiere Pro", "DaVinci Resolve", "After Effects", "Motion Graphics", "Color Grading"],
    "Web Development": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    Design: ["Figma", "UI/UX Design", "Branding", "Prototyping", "Animation"],
  }

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-12 text-gradient">Skills & Expertise</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="bg-card border border-border rounded-lg p-8 hover-lift glow-hover">
              <h3 className="text-2xl font-bold font-display mb-6 text-foreground">{category}</h3>
              <ul className="space-y-3">
                {items.map((skill) => (
                  <li key={skill} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground/80">{skill}</span>
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
