import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mongoApi } from "@/lib/mongoApi";

interface ProjectSubmission {
  name: string;
  email: string;
  projectType: "website" | "ml" | "other";
  message: string;
}

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectSubmission>({
    name: "",
    email: "",
    projectType: "website",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mongoApi.addInquiry(formData);

      toast({
        title: "Message sent!",
        description: "Thank you for your inquiry. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", projectType: "website", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary font-mono text-sm tracking-wider mb-2">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Let's Work <span className="text-gradient">Together</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-up">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Have a project idea? Whether it's a website or an ML solution,
                I'd love to hear about it. Let's discuss how we can bring your ideas to life.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:rahmanhafizur31928@gmail.com"
                className="flex items-center gap-4 glass-card p-4 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">rahmanhafizur31928@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 glass-card p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 9395236443</p>
                  <p className="font-medium">+91 6900757449</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 animate-fade-up animation-delay-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Type</label>
              <div className="flex gap-4">
                {["website", "ml", "other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, projectType: type as any })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${formData.projectType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                  >
                    {type === "website" ? "Website" : type === "ml" ? "ML Project" : "Other"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Details</label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project idea..."
                rows={5}
                className="bg-background/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full py-6 font-semibold"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
