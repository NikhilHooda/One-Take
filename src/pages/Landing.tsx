import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import { Dynamic3DComponent } from "@/components/ui/dynamic-3d-component";
import heroBg from "@/assets/hero-bg.jpg";
import { 
  Zap, 
  Clock, 
  Sparkles, 
  Github,
  Chrome,
  FileCode,
  Package,
  Shield,
  Play,
  BarChart,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
  onLogoClick?: () => void;
}

export const Landing = ({ onGetStarted, onLogoClick }: LandingProps) => {
  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
      
      <Navigation onGetStarted={onGetStarted} onLogoClick={onLogoClick} />
      
      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-20">       
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your AI
                <span className="block text-primary">Demo Video Creator</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your projects into professional demo videos. No editing skills. No manual work. Just pure automation.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-white text-background hover:bg-white/90 transition-all duration-300 px-8"
                >
                  Create Demo <Play className="w-2 h-4 ml-2" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Zero Data Retention
              </p>
            </div>
            
            {/* Right 3D Dashboard Component */}
            <div className="relative z-20">
              <Dynamic3DComponent />
            </div>
          </div>
          
          {/* Integration Logos */}
          <div className="mt-20">
            <p className="text-center text-sm text-muted-foreground mb-8">Integrates with</p>
            <div className="flex items-center justify-center gap-12 opacity-60">
              <Github className="w-8 h-8" />
              <Chrome className="w-8 h-8" />
              <FileCode className="w-8 h-8" />
              <Package className="w-8 h-8" />
              <BarChart className="w-8 h-8" />
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="py-32 bg-card/30 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Highlights</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Every Project Shines With One Take
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature Card 1 */}
            <Card className="bg-card border-border overflow-hidden group hover:shadow-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Clock className="w-24 h-24 text-primary/50" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Save Production Time</h3>
                  <p className="text-muted-foreground mb-6">
                    Free up time for coding instead of video editing
                  </p>
                  <p className="text-sm">
                    One Take analyzes your code and creates professional demos so you no longer need to spend hours on video production.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Card 2 */}
            <Card className="bg-card border-border overflow-hidden group hover:shadow-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-secondary/50" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Impress stakeholders instantly</h3>
                  <p className="text-muted-foreground mb-6">
                    Professional demos ready in minutes, not days
                  </p>
                  <p className="text-sm">
                    AI-generated narratives and visuals that highlight your project's key features and make complex code accessible to everyone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What One Take Delivers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              One platform where developers get instant demo videos, showcase their work professionally, and save countless hours on production.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Feature */}
            <div>
              {/* <p className="text-sm text-muted-foreground mb-4">Transform repositories without manual editing</p> */}
              <h3 className="text-3xl font-bold mb-8">
                Automated Demo Creation
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                We analyze your code structure, README files, and project architecture to create compelling video narratives automatically.
              </p>
              
              {/* Feature List */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="space-y-4">
                  {[
                    { icon: Github, title: "Repository Analysis", status: "Automatic", color: "text-green-500" },
                    { icon: FileCode, title: "Code Walkthrough", status: "AI-Generated", color: "text-yellow-500" },
                    { icon: Sparkles, title: "Voice Narration", status: "Professional", color: "text-blue-500" },
                    { icon: Play, title: "Video Production", status: "One-Click", color: "text-purple-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className={`text-sm ${item.color}`}>• {item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Feature */}
            <div>
              {/* <p className="text-sm text-muted-foreground mb-4">See the impact of your projects</p> */}
              <h3 className="text-3xl font-bold mb-8">
                Professional Results
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                One Take creates videos that showcase your work professionally:
              </p>
              
              <div className="space-y-4">
                {[
                  "HD video quality with smooth transitions",
                  "AI-generated scripts that explain complex code simply",
                  "Custom branding and styling options",
                  "Export to multiple formats for any platform"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Stats Preview */}
              <div className="mt-8 bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Average Creation Time</span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Traditional Video Creation</span>
                      <span className="text-muted-foreground">4-6 hours</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-full bg-red-500/50 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>With One Take</span>
                      <span className="text-primary">5-10 minutes</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[10%] bg-gradient-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your First Demo?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are showcasing their projects professionally with AI-powered demo videos.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-background hover:bg-white/90 transition-all duration-300 px-8"
          >
            Start Creating Now <Zap className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};