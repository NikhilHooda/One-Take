import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Download, Twitter, Linkedin, ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

interface VideoResultsProps {
  videoData: any;
  onCreateAnother: () => void;
  onLogoClick?: () => void;
}

export const VideoResults = ({ videoData, onCreateAnother, onLogoClick }: VideoResultsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    // In a real app, this would download the actual video file
    const link = document.createElement('a');
    link.href = videoData.videoUrl;
    link.download = 'demo-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your demo video is being downloaded.",
    });
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent("Just created an amazing demo video for my project using AI! Check out this revolutionary tool for developers and startups. #AI #DemoVideo #Startup");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("AI-Generated Demo Video");
    const summary = encodeURIComponent("Created a professional demo video for my project using AI technology. This tool is a game-changer for developers and entrepreneurs!");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Video link copied to clipboard!",
    });
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                🎉 Your Demo Video is Ready!
              </h1>
              <p className="text-lg text-muted-foreground">
                Your professional demo video has been generated successfully
              </p>
            </div>

            {/* Video Player Card */}
            <Card className="bg-card border-border shadow-card mb-8">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster="/placeholder.svg"
                  >
                    <source src={videoData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Demo Video</h3>
                  <p className="text-muted-foreground mb-4">
                    Generated from: {videoData.githubUrl}
                    {videoData.websiteUrl && ` • ${videoData.websiteUrl}`}
                  </p>
                  {videoData.specifications && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Specifications:</strong> {videoData.specifications}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-card border-border shadow-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Download & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                  
                  <Button
                    onClick={handleShareTwitter}
                    variant="outline"
                    size="lg"
                    className="border-border hover:bg-muted/50"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on X
                  </Button>
                  
                  <Button
                    onClick={handleShareLinkedIn}
                    variant="outline"
                    size="lg"
                    className="border-border hover:bg-muted/50"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                  </Button>
                  
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="lg"
                    className="border-border hover:bg-muted/50"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Create Another Video */}
            <Card className="bg-gradient-secondary border-border">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">Ready to Create Another?</h3>
                <p className="text-muted-foreground mb-6">
                  Generate demo videos for your other projects and showcase your entire portfolio
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={onCreateAnother}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
                  >
                    Create Another Video
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="lg"
                    className="border-border hover:bg-muted/50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};