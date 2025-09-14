import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Github,
  FileCode,
  Play
} from "lucide-react";

export const Dynamic3DComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('3d-component')?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const component = document.getElementById('3d-component');
    if (component) {
      component.addEventListener('mousemove', handleMouseMove);
      return () => component.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[600px] p-8">
      {/* Floating Animation Container */}
      <div 
        id="3d-component"
        className="relative w-full max-w-md transform-gpu transition-all duration-500 ease-out hover:scale-105"
        style={{
          transform: `perspective(1000px) rotateX(${isHovered ? mousePosition.y * 0.5 : 5}deg) rotateY(${isHovered ? mousePosition.x * 0.5 : -5}deg) translateZ(${isHovered ? 20 : 0}px)`,
          animation: 'float 6s ease-in-out infinite'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main 3D Card */}
        <div className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
          
          {/* Content Container */}
          <div className="relative z-10 p-6 space-y-6">
            {/* Status Items */}
            <div className="space-y-3">
              {/* Analyzing GitHub */}
              <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Github className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Analyzing Github</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 shadow-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Complete
                </Badge>
              </div>
              
              {/* Generating Voiceover */}
              <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <FileCode className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Generating Voiceover</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
                  Syncing
                </Badge>
              </div>
              
              {/* Video Rendering */}
              <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-muted/60 to-muted/40 rounded-xl border border-border/30 hover:border-border/50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/60 rounded-lg">
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Project Overview</span>
                </div>
                <Badge className="bg-muted/60 text-muted-foreground border-border/30">
                  Pending
                </Badge>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
                <span className="text-sm font-bold text-primary">75%</span>
              </div>
              <div className="relative h-3 bg-muted/60 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: '75%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            
            {/* Voice Note Section */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">Post to LinkedIn</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors">
                  Accept
                </button>
                <button className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors">
                  Restart
                </button>
              </div>
            </div>
          </div>
          
          {/* Edge Highlight */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
        </div>

        {/* Additional Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse" />
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Custom CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
