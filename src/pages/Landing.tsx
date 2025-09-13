import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { CheckCircle, Zap, Clock, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface LandingProps {
  onGetStarted: () => void;
}

export const Landing = ({ onGetStarted }: LandingProps) => {
  const features = [
    {
      icon: Zap,
      title: "Automated Storyboard Creation",
      description: "AI analyzes your GitHub repository and automatically creates compelling video narratives."
    },
    {
      icon: Sparkles,
      title: "AI-Generated Voiceover",
      description: "Professional quality narration generated to perfectly match your demo's content."
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description: "Transform hours of video production work into minutes with intelligent automation."
    }
  ];

  const testimonials = [
    {
      quote: "Transformed our GitHub project into a professional demo video in under 10 minutes. Game-changer!",
      author: "Sarah Chen",
      role: "Startup Founder"
    },
    {
      quote: "The AI perfectly captured our product's value proposition. Investors were impressed.",
      author: "Marcus Rodriguez",
      role: "CTO, TechCorp"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onGetStarted={onGetStarted} />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="container relative mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Transform Code into Compelling Demo Videos
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI agents analyze your GitHub repositories and websites to create professional video demos automatically. 
              No video editing experience required.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg px-8 py-6 shadow-glow hover:shadow-card animate-glow"
            >
              Create Your Demo Video
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Professional Demo Videos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of demo video creation, 
              from analysis to final production.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Perfect for Developers & Entrepreneurs
              </h2>
              <div className="space-y-4">
                {[
                  "Showcase your projects to investors and clients",
                  "Create marketing content without video skills",
                  "Generate demos for portfolio presentations",
                  "Save weeks of production time"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-secondary p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Ready to Get Started?</h3>
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Join thousands of developers creating professional demo videos in minutes
                </p>
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
                >
                  Start Creating Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Innovative Teams
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border shadow-card">
                <CardContent className="p-6">
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};