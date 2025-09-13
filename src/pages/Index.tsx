import { useState } from "react";
import { Landing } from "./Landing";
import { VideoGeneration } from "./VideoGeneration";
import { VideoResults } from "./VideoResults";

type AppState = "landing" | "generation" | "results";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [videoData, setVideoData] = useState(null);

  const handleGetStarted = () => {
    setCurrentState("generation");
  };

  const handleVideoGenerated = (data: any) => {
    setVideoData(data);
    setCurrentState("results");
  };

  const handleCreateAnother = () => {
    setVideoData(null);
    setCurrentState("generation");
  };

  const renderCurrentPage = () => {
    switch (currentState) {
      case "landing":
        return <Landing onGetStarted={handleGetStarted} />;
      case "generation":
        return <VideoGeneration onVideoGenerated={handleVideoGenerated} />;
      case "results":
        return <VideoResults videoData={videoData} onCreateAnother={handleCreateAnother} />;
      default:
        return <Landing onGetStarted={handleGetStarted} />;
    }
  };

  return <div className="dark">{renderCurrentPage()}</div>;
};

export default Index;
