import { useNavigate } from "react-router-dom";
import { Landing } from "./Landing";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/video-generation");
  };

  const handleLogoClick = () => {
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dark">
      <Landing onGetStarted={handleGetStarted} onLogoClick={handleLogoClick} />
    </div>
  );
};

export default Index;
