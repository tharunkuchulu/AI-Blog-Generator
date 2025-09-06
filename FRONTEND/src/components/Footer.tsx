import React from 'react';
import { Github, Linkedin, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/tharunkuchulu',
    icon: Github,
  },
  {
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/in/tharun-vankayala/',
    icon: Linkedin,
  },
  {
    name: 'Portfolio',
    url: 'https://tharunvankayala.netlify.app/',
    icon: Globe,
  },
  {
    name: 'Email',
    url: 'mailto:vankayalatharun@gmail.com',
    icon: Mail,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 pb-12">
      <div className="text-center space-y-6">
        <p className="text-lg text-muted-foreground">
          Built using React, FastAPI, and OpenRouter by{' '}
          <span className="gradient-text font-semibold">Tharun Vankayala</span>
        </p>
        
        <div className="flex justify-center space-x-4">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Button
                key={link.name}
                variant="outline"
                size="icon"
                asChild
                className="h-12 w-12 rounded-full glow-hover transition-all duration-300 hover:scale-110"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;