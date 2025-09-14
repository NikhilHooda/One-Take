import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/ui/navigation";
import { Github, Globe, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";
import { StoryboardService } from "@/services/storyboardService";

interface VideoGenerationProps {
  onStoryboardGenerated: () => void;
  onLogoClick?: () => void;
}

export const VideoGeneration = ({ onStoryboardGenerated, onLogoClick }: VideoGenerationProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    githubUrl: "",
    websiteUrl: "",
    specifications: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const { toast } = useToast();

  const validateUrl = (url: string, type: string) => {
    try {
      const urlObj = new URL(url);
      if (type === 'github') {
        return urlObj.hostname === 'github.com';
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.websiteUrl) {
      toast({
        title: "Website URL Required",
        description: "Please provide a valid deployed website URL.",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(formData.websiteUrl, 'website')) {
      toast({
        title: "Invalid Website URL",
        description: "Please enter a valid website URL.",
        variant: "destructive"
      });
      return;
    }

    if (formData.githubUrl && !validateUrl(formData.githubUrl, 'github')) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress("Initializing storyboard generation...");

    try {
      toast({
        title: "Processing Started",
        description: "AI is analyzing your project and generating storyboard workflow. This may take 10-15 seconds...",
      });

      setGenerationProgress("Analyzing website structure...");
      
      // Call the real storyboard generation API
      const response = await StoryboardService.generateStoryboard({
        githubUrl: formData.githubUrl || undefined,
        websiteUrl: formData.websiteUrl,
        specifications: formData.specifications
      });

      setGenerationProgress("Generating storyboard scenes...");
      
      // Navigate to storyboard flow with the generated data
      navigate('/storyboard', { 
        state: { 
          storyboardData: response.storyboard,
          transcript: response.transcript,
          requestId: response.requestId,
          generatedAt: response.generatedAt,
          sourceUrls: {
            githubUrl: formData.githubUrl,
            websiteUrl: formData.websiteUrl
          }
        } 
      });
      
      toast({
        title: "Storyboard Generated Successfully!",
        description: "Your workflow is ready for customization.",
      });
    } catch (error) {
      console.error('Storyboard generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your storyboard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress("");
    }
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: '2000%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
      
      <Navigation showGetStarted={false} onLogoClick={onLogoClick} />
      
      <div className="pt-36 pb-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Generate Your Demo Video
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide your project details and let our AI create a professional demo video
              </p>
            </div>

            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="website-url" className="text-base font-medium">
                      Deployed Website URL *
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="website-url"
                        type="url"
                        placeholder="https://your-project.com"
                        className="pl-10 bg-input border-border focus:ring-primary"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github-url" className="text-base font-medium">
                      GitHub Repository URL (Optional)
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="github-url"
                        type="url"
                        placeholder="https://github.com/username/repository"
                        className="pl-10 bg-input border-border focus:ring-primary"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specifications" className="text-base font-medium">
                      Additional Specifications (Optional)
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                      <Textarea
                        id="specifications"
                        placeholder="Any specific focus areas, target audience, or special requirements for your demo video..."
                        className="pl-10 bg-input border-border focus:ring-primary min-h-[100px] resize-none"
                        value={formData.specifications}
                        onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg py-6"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Storyboard...
                      </>
                    ) : (
                      "Generate Storyboard"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {isGenerating && (
              <Card className="mt-6 bg-gradient-secondary border-border">
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI Processing in Progress</h3>
                    <p className="text-muted-foreground mb-2">
                      Our AI is analyzing your repository, extracting key features, and creating your storyboard workflow...
                    </p>
                    {generationProgress && (
                      <p className="text-sm text-primary font-medium">
                        {generationProgress}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};