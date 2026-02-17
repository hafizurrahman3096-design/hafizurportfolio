import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "./SocialLinks";
import hafizurPhoto from "@/assets/hafizur-photo.png";
import { useEffect, useState } from "react";
import { mongoApi } from "@/lib/mongoApi";

export const HeroSection = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadProfilePhoto = async () => {
      try {
        const data = await mongoApi.getProfile();
        if (data?.profile_photo_url) {
          setProfilePhoto(data.profile_photo_url);
        }
      } catch (err) {
        console.error("Error loading profile photo:", err);
      }
    };

    loadProfilePhoto();
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Text Content with Photo */}
        <div className="space-y-3 animate-fade-up">
          {/* Photo + Name Row */}
          <div className="flex items-center gap-4">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl scale-90" />
              <div className="relative glass-card p-1.5 rounded-2xl glow overflow-hidden">
                <img
                  src={profilePhoto || hafizurPhoto}
                  alt="Hafizur Rahman"
                  className="w-24 h-28 md:w-32 md:h-40 object-cover object-top rounded-xl"
                />
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-0.5">
              <p className="text-primary font-mono text-sm tracking-wider">Hello, I'm</p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Hafizur <span className="text-gradient">Rahman</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Web Developer & ML Enthusiast
              </p>
            </div>
          </div>

          <p className="text-muted-foreground max-w-md leading-relaxed">
            Crafting beautiful web experiences and exploring the frontiers of machine learning.
            Building solutions that make a difference.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="rounded-full px-8 py-6 font-semibold animate-pulse-glow"
            >
              <a href="#contact">Let's Work Together</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full px-8 py-6 font-semibold border-primary/30 hover:bg-primary/10"
            >
              <a href="#projects">View Projects</a>
            </Button>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Find me on</p>
            <SocialLinks size="lg" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
};
