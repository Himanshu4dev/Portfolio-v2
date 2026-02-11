export default function Services() {
  const services = [
    {
      title: "Product UI/UX Design",
      subtitle: "From idea to intuitive interface",
      description:
        "I design clean, conversion-focused interfaces for web apps, landing pages, and dashboards with a strong focus on hierarchy, spacing, and real-world constraints.",
      bullets: ["User journeys & flows", "High‑fidelity Figma designs", "Design systems & UI kits"],
    },
    {
      title: "React & Next.js Frontend",
      subtitle: "Production-ready interfaces in code",
      description:
        "I implement responsive, accessible UIs using modern React, Next.js, and TypeScript — with smooth animations that feel refined, not distracting.",
      bullets: ["Component-driven architecture", "Design‑to‑code implementation", "Performance & accessibility"],
    },
    {
      title: "Video Editing & Motion",
      subtitle: "Stories that feel premium",
      description:
        "I craft cinematic videos, reels, ads, and brand pieces that feel polished end‑to‑end — edit, color, sound, and motion graphics.",
      bullets: ["Cinematic edits & pacing", "Color grading & sound design", "Social‑first cuts & reels"],
    },
  ]

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-card/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground/80 mb-2">
            What I do
          </p>
          <h2
            data-animate="heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-foreground tracking-tight"
          >
            Services at a glance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service) => (
            <article
              key={service.title}
              data-animate="card"
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-7 card-hover"
            >
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-muted-foreground mb-2">
                {service.subtitle}
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {service.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

