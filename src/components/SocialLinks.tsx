import { Linkedin, Github, Instagram, Facebook } from "lucide-react";

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  colorClass: string;
}

const socials: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/hafizur-rahman-767655292",
    colorClass: "social-linkedin",
  },
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/hafizur805",
    colorClass: "social-github",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/hafizur805",
    colorClass: "social-instagram",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/share/1AYj6GARh3/",
    colorClass: "social-facebook",
  },
];

interface SocialLinksProps {
  size?: "sm" | "md" | "lg";
}

export const SocialLinks = ({ size = "md" }: SocialLinksProps) => {
  const iconSize = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6";
  
  return (
    <div className="flex items-center gap-4">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${social.colorClass} social-icon text-muted-foreground`}
          aria-label={social.name}
        >
          <social.icon className={iconSize} />
        </a>
      ))}
    </div>
  );
};
