import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface NavigationProps {
  onGetStarted?: () => void;
  showGetStarted?: boolean;
}

export const Navigation = ({ onGetStarted, showGetStarted = true }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Demo Creator
          </span>
        </div>
        
        {showGetStarted && (
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        )}
      </div>
    </nav>
  );
};