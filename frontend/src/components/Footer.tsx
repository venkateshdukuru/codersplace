// frontend/src/components/Footer.tsx
import { Link } from "react-router-dom";
import {
  Code,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    platform: [
      { name: "Home", href: "/" },
      { name: "Coding Practice", href: "coding" },
      { name: "ARV Preparation", href: "arv" },
      { name: "Interview Prep", href: "interview" },
      { name: "Hackathons", href: "hackathons" },
    ],
    resources: [
      { name: "Documentation", href: "https://projectsplace.in" },
      { name: "Tutorials", href: "https://projectsplace.in" },
      { name: "Blog", href: "https://projectsplace.in" },
      { name: "Community", href: "https://projectsplace.in" },
      { name: "Support", href: "https://projectsplace.in" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-card border-t border-border text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CodersPlace
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed text-[0.9rem]">
              Empowering students and professionals to excel in coding,
              interviews, and competitive programming through curated practice
              and preparation resources.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-secondary hover:bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
                    aria-label={social.label}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5 pt-4 border-t border-border">
              <div className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contact@coderplace.in">contact@coderplace.in</a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+916300982015">+91 6300982015</a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Chennai, India</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              Platform
              <ChevronRight className="w-4 h-4 ml-1 text-primary" />
            </h3>
            <ul className="space-y-2.5">
              {navigation.platform.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              Resources
              <ChevronRight className="w-4 h-4 ml-1 text-primary" />
            </h3>
            <ul className="space-y-2.5">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              Legal
              <ChevronRight className="w-4 h-4 ml-1 text-primary" />
            </h3>
            <ul className="space-y-2.5">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("/auth") ? (
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-foreground mb-1">
                Stay Updated
              </h3>
              <p className="text-xs text-muted-foreground">
                Get the latest updates on competitions and new features
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs w-full sm:w-64"
              />
              <button className="px-5 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:shadow-md hover:scale-105 transition-all duration-300 text-xs">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear} CodersPlace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;