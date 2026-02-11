export default function Projects() {
  const projects = [
    {
      title: "SaaS dashboard UX & UI",
      category: "Product UI/UX · Frontend",
      description:
        "Redesigned a B2B analytics dashboard with clearer information hierarchy, dark‑mode friendly visuals, and a React component system ready for growth.",
      tags: ["Product design", "Figma system", "React/Next.js"],
    },
    {
      title: "E‑commerce landing & flows",
      category: "UI/UX · React",
      description:
        "Crafted a high‑converting landing page and checkout flow with refined typography, responsive grid, and a smooth, app‑like feel.",
      tags: ["Landing page", "Conversion UX", "Next.js"],
    },
    {
      title: "Launch promo edit",
      category: "Video Editing",
      description:
        "Edited a launch promo with fast, clean cuts, color‑graded b‑roll, sound design, and light motion graphics that stayed on‑brand.",
      tags: ["Premiere Pro", "Color grading", "Motion graphics"],
    },
    {
      title: "Creator reel system",
      category: "Short‑form video",
      description:
        "Built a repeatable edit system for reels and shorts: hooks, pacing, typography overlays, and exporting presets for multiple platforms.",
      tags: ["Reels", "Short‑form", "Templates"],
    },
    {
      title: "Brand identity motion kit",
      category: "Video & brand",
      description:
        "Created a pack of intros, lower‑thirds, transitions, and logo animations that made all future video content feel consistently on‑brand.",
      tags: ["Branding", "Motion design", "After Effects"],
    },
    {
      title: "Personal portfolio system",
      category: "Design · React",
      description:
        "Designed and implemented this portfolio as a reusable, content‑driven system that showcases both UI/UX and video work together.",
      tags: ["Design & code", "Next.js", "Tailwind CSS"],
    },
  ]

  return (
    <section id="projects" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-card/20">
      <div className="max-w-6xl mx-auto">
        <h2
          data-animate="heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-8 sm:mb-12 text-foreground tracking-tight"
        >
          Selected case studies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              data-animate="card"
              className="bg-card border border-border rounded-lg p-6 sm:p-8 group cursor-pointer transform transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(44,44,44,0.1)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <div className="mb-4 inline-block px-2 sm:px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-semibold text-foreground">{project.category}</span>
              </div>
              <h3
                data-animate="heading"
                className="text-xl sm:text-2xl font-black font-display mb-3 text-foreground transition-all"
              >
                {project.title}
              </h3>
              <p className="text-foreground text-sm sm:text-base mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
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
