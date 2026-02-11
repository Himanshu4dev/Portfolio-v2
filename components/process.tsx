export default function Process() {
  const steps = [
    {
      label: "01",
      title: "Discover & define",
      description:
        "We clarify goals, audience, success metrics, and the story you want your product or video to tell.",
    },
    {
      label: "02",
      title: "Design & prototype",
      description:
        "I translate ideas into Figma flows, interactive prototypes, and motion drafts you can react to quickly.",
    },
    {
      label: "03",
      title: "Build, edit & refine",
      description:
        "Your UI ships as clean React/Next.js code and your videos are edited, graded, and polished for launch.",
    },
  ]

  return (
    <section id="process" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-card/10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground/80 mb-2">
            How we work
          </p>
          <h2
            data-animate="heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-foreground tracking-tight"
          >
            A simple, clear process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.label}
              data-animate="card"
              className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 sm:p-6 md:p-7 card-hover"
            >
              <span className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground">
                {step.label}
              </span>
              <h3 className="mt-3 text-lg sm:text-xl md:text-2xl font-display font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

