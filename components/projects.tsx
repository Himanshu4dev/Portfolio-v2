export default function Projects() {
  const projects = [
    {
      title: "Brand Documentary",
      category: "Video Editing",
      description: "A compelling 15-minute documentary showcasing a tech startup's journey and impact.",
      tags: ["Premiere Pro", "Motion Graphics", "Color Grading"],
    },
    {
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Full-stack e-commerce solution with real-time inventory and payment integration.",
      tags: ["Next.js", "React", "Stripe", "PostgreSQL"],
    },
    {
      title: "Music Video Production",
      category: "Video Editing",
      description: "High-energy music video with custom visual effects and synchronized animations.",
      tags: ["After Effects", "DaVinci Resolve", "VFX"],
    },
    {
      title: "SaaS Dashboard",
      category: "Web Development",
      description: "Analytics dashboard with real-time data visualization and user management.",
      tags: ["React", "TypeScript", "Recharts", "Tailwind"],
    },
    {
      title: "Corporate Branding",
      category: "Video Editing",
      description: "Complete brand identity video suite including intro, transitions, and lower thirds.",
      tags: ["Motion Design", "Branding", "Animation"],
    },
    {
      title: "Portfolio Website",
      category: "Web Development",
      description: "Premium portfolio website with interactive animations and smooth scrolling.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
  ]

  return (
    <section id="projects" className="py-20 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2
          data-animate="heading"
          className="text-4xl md:text-5xl font-black font-display mb-12 text-foreground tracking-tight"
        >
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              data-animate="card"
              className="bg-card border border-border rounded-lg p-8 hover-lift glow-hover group cursor-pointer transform transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(44,44,44,0.1)]"
            >
              <div className="mb-4 inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-semibold text-foreground">{project.category}</span>
              </div>
              <h3
                data-animate="heading"
                className="text-2xl font-black font-display mb-3 text-foreground transition-all"
              >
                {project.title}
              </h3>
              <p className="text-foreground mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
