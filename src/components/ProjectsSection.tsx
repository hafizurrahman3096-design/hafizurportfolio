import { useState, useEffect } from "react";
import { ExternalLink, Globe, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mongoApi } from "@/lib/mongoApi";

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
}

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await mongoApi.getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary font-mono text-sm tracking-wider mb-2">My Work</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No projects to display yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {project.type === "web" ? (
                      <Globe className="w-6 h-6 text-primary" />
                    ) : (
                      <Brain className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs uppercase">
                    {project.type}
                  </Badge>
                </div>

                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
