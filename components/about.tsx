export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-12 text-gradient">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              I'm a passionate video editor and web developer with years of experience creating stunning digital content
              and interactive web experiences. My journey spans from crafting compelling video narratives to building
              responsive, high-performance web applications.
            </p>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              I believe in the power of combining creative vision with technical excellence. Every project I undertake
              is an opportunity to push boundaries and deliver exceptional results that exceed expectations.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              When I'm not creating, you'll find me exploring new design trends, experimenting with emerging
              technologies, or collaborating with talented creators to bring ambitious ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Projects Completed", value: "50+" },
              { label: "Years Experience", value: "5+" },
              { label: "Happy Clients", value: "40+" },
              { label: "Awards Won", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-6 hover-lift glow-hover">
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
