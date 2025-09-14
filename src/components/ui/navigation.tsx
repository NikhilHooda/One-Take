import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useState, useEffect } from "react";
import LOGO from "@/assets/LOGO.png";

interface NavigationProps {
  onGetStarted?: () => void;
  onLogoClick?: () => void;
  showGetStarted?: boolean;
}

export const Navigation = ({ onGetStarted, onLogoClick, showGetStarted = true }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled past the hero section (roughly viewport height)
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      setIsScrolled(scrollPosition > viewportHeight * 0.7);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 shadow-lg w-[80%] rounded-xl ${
      isScrolled 
        ? 'bg-muted/90 backdrop-blur-md border border-border/20 shadow-xl' 
        : 'bg-muted/80 backdrop-blur-md shadow-md'
    }`}>
      <div className={`px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}>
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 transition-all duration-200 px-3 py-2 rounded-lg"
          onClick={onLogoClick}
          title="Back to Home"
        >
          <img 
            src={LOGO} 
            alt="One Take Logo" 
            className={`transition-all duration-300 ${
              isScrolled ? 'h-6 w-8' : 'h-8 w-12'
            }`}
          />
          <span className={`font-bold text-white transition-all duration-300 ${
            isScrolled ? 'text-lg' : 'text-xl'
          }`}>
            ONE TAKE
          </span>
        </div>
        
        {/* Center Navigation Links */}
        <nav className={`hidden md:flex items-center transition-all duration-300 ${
          isScrolled ? 'space-x-6' : 'space-x-8'
        }`}>
          <a href="#highlights" className={`text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 px-3 py-2 rounded-lg ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            Highlights
          </a>
          <a href="#features" className={`text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 px-3 py-2 rounded-lg ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            Features
          </a>
          <a href="#how-it-works" className={`text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 px-3 py-2 rounded-lg ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            How It Works
          </a>
          <a href="#contact" className={`text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 px-3 py-2 rounded-lg ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            Contact
          </a>
        </nav>
        
        {/* CTA Button */}
        {showGetStarted && (
          <Button 
            onClick={onGetStarted}
            className={`bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-full font-medium ${
              isScrolled ? 'px-4 py-1.5 text-xs' : 'px-6 py-2 text-sm'
            }`}
          >
            Create Demo →
          </Button>
        )}
      </div>
    </nav>
  );
};