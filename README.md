# One Take - AI-Powered Video Creation Platform

One Take is a revolutionary platform that transforms your ideas into professional demo videos using AI-powered storyboard creation and automated video generation. Create compelling visual narratives for your projects, products, or workflows with an intuitive drag-and-drop interface.

check out our devpost submission & live video demo here: https://tinyurl.com/ycz943wk

## 🚀 Features

### 🎬 AI-Powered Video Creation
- **Intelligent Storyboard Generation**: Create detailed storyboards with AI assistance
- **Workflow Automation**: Design step-by-step processes for any use case
- **Real-time AI Chat**: Get instant help and suggestions from our specialized AI assistant
- **Professional Video Output**: Generate high-quality demo videos from your storyboards

### 🎨 Interactive Storyboard Editor
- **Drag-and-Drop Interface**: Easy-to-use React Flow-based editor
- **Customizable Nodes**: Edit titles and descriptions for each scene
- **Visual Workflow Design**: Create clear, logical flows for your content
- **Resizable Sidebar**: Adjustable AI assistant panel for optimal workflow

### 🤖 Smart AI Assistant
- **Context-Aware Responses**: AI understands your specific storyboard and workflow
- **Cohere Integration**: Powered by advanced reasoning AI for intelligent assistance
- **Workflow Guidance**: Get help with video creation, storyboarding, and content planning
- **Real-time Support**: Instant answers to your questions about the platform

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Themes**: Beautiful, modern interface with theme support
- **Smooth Animations**: Polished interactions and transitions
- **Accessible Components**: Built with accessibility in mind

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Flow** for workflow visualization
- **React Router** for navigation

### AI & Backend
- **Cohere AI** for intelligent chat assistance
- **GROQ Cloud** for intelligent chat assistance
- **React Query** for state management

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **PostCSS** for CSS processing
- **Lovable Tagger** for development assistance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd repo-reel-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_COHERE_API_KEY=your_cohere_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 📖 Usage

### Creating Your First Storyboard

1. **Start a New Workflow**
   - Click "Get Started" on the landing page
   - Choose your project type or start from scratch

2. **Design Your Storyboard**
   - Add nodes for each step in your process
   - Edit titles and descriptions for each scene
   - Connect nodes to create a logical flow
   - Use the AI assistant for guidance and suggestions

3. **Customize Your Content**
   - Edit node titles and descriptions
   - Adjust the workflow as needed
   - Get real-time feedback from the AI assistant

4. **Generate Your Video**
   - Click "Run" to process your storyboard
   - View your generated video on the results page
   - Download, share, or create another video

### AI Assistant Features

The AI assistant is context-aware and can help you with:
- **Workflow Planning**: Get suggestions for your storyboard structure
- **Content Creation**: Receive help with scene descriptions and titles
- **Platform Guidance**: Learn how to use different features
- **Best Practices**: Get tips for effective video creation

## 🎯 Example Workflows

### E-commerce Demo
Create step-by-step shopping workflows:
- Product browsing
- Cart management
- Checkout process
- User onboarding

### Software Tutorials
Build interactive software demonstrations:
- Feature walkthroughs
- Setup processes
- Configuration guides
- Troubleshooting steps

### Business Processes
Document and visualize business workflows:
- Customer onboarding
- Sales processes
- Support procedures
- Training materials

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_COHERE_API_KEY` | Cohere AI API key for chat assistance | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Optional |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

### Customization

- **Themes**: Modify `tailwind.config.ts` for custom styling
- **Components**: Customize UI components in `src/components/ui/`
- **Pages**: Add new pages in `src/pages/`
- **AI Prompts**: Update AI context in `StoryboardFlow.tsx`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**One Take** - Transform your ideas into compelling videos with the power of AI. 🎬✨
