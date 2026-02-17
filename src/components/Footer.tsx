import { Settings } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xl font-bold text-gradient mb-2">Hafizur Rahman</p>
            <p className="text-sm text-muted-foreground">
              Web Developer & ML Enthusiast
            </p>
          </div>

          <SocialLinks size="md" />

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            <Link
              to="/admin-login"
              className="p-2 rounded-full text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-all duration-300"
              title="Admin Panel"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
