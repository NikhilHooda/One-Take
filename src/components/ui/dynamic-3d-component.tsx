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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('3d-component')?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 15, y: y * 15 });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const component = document.getElementById('3d-component');
    if (component) {
      component.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
      return () => {
        component.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[600px] p-8 perspective-1000">
      {/* 3D Container with dramatic perspective */}
      <div className="relative w-full max-w-lg transform-gpu">
        {/* Floating Animation Container */}
        <div 
          id="3d-component"
          className="relative w-full transform-gpu transition-all duration-500 ease-out"
          style={{
            transform: `perspective(1000px) 
              rotateX(${isHovered ? mousePosition.y * 0.8 : 8 + Math.sin(scrollY * 0.01) * 3}deg) 
              rotateY(${isHovered ? mousePosition.x * 0.8 : -8 + Math.cos(scrollY * 0.008) * 3}deg) 
              translateZ(${isHovered ? 40 : 20 + Math.sin(scrollY * 0.005) * 5}px)
              translateY(${isHovered ? mousePosition.y * 0.3 : Math.sin(scrollY * 0.003) * 15}px)
              translateX(${isHovered ? mousePosition.x * 0.3 : 0}px)`,
            animation: isHovered ? 'none' : 'float 6s ease-in-out infinite, sway 10s ease-in-out infinite',
            filter: isHovered ? 'brightness(1.05) saturate(1.1)' : 'brightness(1) saturate(1)',
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(244, 58%, 64%, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.08)' 
              : '0 15px 35px -5px rgba(0, 0, 0, 0.2), 0 0 20px rgba(244, 58%, 64%, 0.15), inset 0 0 8px rgba(255, 255, 255, 0.03)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        {/* Main 3D Card */}
        <div className="relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          
          {/* Ambient Glow */}
          <div 
            className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 rounded-2xl blur-lg transition-all duration-300"
            style={{
              opacity: isHovered ? 0.7 : 0.5,
              transform: isHovered ? `scale(${1.02 + Math.abs(mousePosition.x) * 0.005})` : 'scale(1)'
            }}
          />
          
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

        {/* Subtle Floating Elements */}
        <div 
          className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
          style={{ 
            animation: isHovered ? 'none' : 'float 3s ease-in-out infinite, pulse 2s ease-in-out infinite',
            animationDelay: '0s',
            transform: isHovered ? `translate3d(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px, 10px) scale(${isHovered ? 1.2 : 1})` : 'translate3d(0, 0, 0) scale(1)',
            opacity: isHovered ? 0.8 : 0.6,
            filter: 'blur(4px)'
          }}
        />
        <div 
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 rounded-full blur-md"
          style={{ 
            animation: isHovered ? 'none' : 'float 4s ease-in-out infinite, pulse 3s ease-in-out infinite',
            animationDelay: '1s',
            transform: isHovered ? `translate3d(${mousePosition.x * -0.15}px, ${mousePosition.y * -0.15}px, 15px) scale(${isHovered ? 1.15 : 1})` : 'translate3d(0, 0, 0) scale(1)',
            opacity: isHovered ? 0.7 : 0.5,
            filter: 'blur(6px)'
          }}
        />
        <div 
          className="absolute top-1/2 -right-8 w-6 h-6 bg-accent/30 rounded-full blur-sm"
          style={{ 
            animation: isHovered ? 'none' : 'sway 5s ease-in-out infinite, pulse 2.5s ease-in-out infinite',
            animationDelay: '0.5s',
            transform: isHovered ? `translate3d(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.1}px, 20px) scale(${isHovered ? 1.3 : 1})` : 'translate3d(0, 0, 0) scale(1)',
            opacity: isHovered ? 0.9 : 0.7,
            filter: 'blur(3px)'
          }}
        />
        <div 
          className="absolute -top-8 left-1/4 w-4 h-4 bg-primary/40 rounded-full blur-sm"
          style={{ 
            animation: isHovered ? 'none' : 'float 6s ease-in-out infinite, pulse 4s ease-in-out infinite',
            animationDelay: '2.5s',
            transform: isHovered ? `translate3d(${mousePosition.x * -0.1}px, ${mousePosition.y * 0.2}px, 25px) scale(${isHovered ? 1.4 : 1})` : 'translate3d(0, 0, 0) scale(1)',
            opacity: isHovered ? 0.8 : 0.4,
            filter: 'blur(2px)'
          }}
        />
        </div>
      </div>

      {/* Custom CSS for 3D floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          25% { 
            transform: translate3d(0, -15px, 8px) rotateX(1deg) rotateY(0.5deg) rotateZ(0.5deg); 
          }
          50% { 
            transform: translate3d(0, -25px, 12px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          75% { 
            transform: translate3d(0, -10px, 6px) rotateX(-0.5deg) rotateY(-0.5deg) rotateZ(-0.5deg); 
          }
        }
        
        @keyframes sway {
          0%, 100% { 
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          25% { 
            transform: translate3d(8px, 0, 10px) rotateX(0.5deg) rotateY(1deg) rotateZ(0.3deg); 
          }
          50% { 
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          75% { 
            transform: translate3d(-8px, 0, 8px) rotateX(-0.5deg) rotateY(-1deg) rotateZ(-0.3deg); 
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
