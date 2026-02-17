import { Code2, Brain, Palette, Rocket } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building responsive, modern web applications with React, TypeScript, and modern frameworks.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Applying deep learning techniques for image classification and data analysis.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive and beautiful user interfaces that provide great experiences.",
  },
  {
    icon: Rocket,
    title: "Problem Solving",
    description: "Tackling complex challenges with creative and efficient solutions.",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary font-mono text-sm tracking-wider mb-2">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            What I <span className="text-gradient">Do</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="glass-card p-6 group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <skill.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{skill.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
