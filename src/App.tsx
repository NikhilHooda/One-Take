import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { StoryboardFlow } from "./pages/StoryboardFlow";
import { VideoGeneration } from "./pages/VideoGeneration";
import { VideoResults } from "./pages/VideoResults";

// Wrapper component for StoryboardFlow to handle routing
const StoryboardFlowWrapper = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleGenerateVideo = (storyboardData: any) => {
    navigate('/video-generation', { state: { storyboardData } });
  };

  return (
    <StoryboardFlow 
      onLogoClick={handleLogoClick}
      onGenerateVideo={handleGenerateVideo}
    />
  );
};

// Wrapper component for VideoGeneration to handle routing
const VideoGenerationWrapper = () => {
  const navigate = useNavigate();

  const handleStoryboardGenerated = () => {
    navigate('/storyboard');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <VideoGeneration 
      onStoryboardGenerated={handleStoryboardGenerated}
      onLogoClick={handleLogoClick}
    />
  );
};

// Wrapper component for VideoResults to handle routing state
const VideoResultsWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const videoData = location.state?.videoData || {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Demo Video',
    description: 'Your workflow demo video'
  };

  const handleCreateAnother = () => {
    navigate('/storyboard');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <VideoResults 
      videoData={videoData} 
      onCreateAnother={handleCreateAnother}
      onLogoClick={handleLogoClick}
    />
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/storyboard" element={<StoryboardFlowWrapper />} />
          <Route path="/video-generation" element={<VideoGenerationWrapper />} />
          <Route path="/video-results" element={<VideoResultsWrapper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
