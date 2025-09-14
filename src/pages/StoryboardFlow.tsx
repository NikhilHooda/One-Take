import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import heroBg from '@/assets/hero-bg.jpg';
import LOGO from '@/assets/LOGO.png';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StoryboardDetails } from '@/components/StoryboardDetails';
import {
  Send,
  Settings,
  Video,
  MessageCircle,
  Plus,
  Trash2,
  Mail,
  Brain,
  Hash,
  Key,
  Play
} from 'lucide-react';

interface StoryboardFlowProps {
  onLogoClick?: () => void;
  onGenerateVideo?: (storyboardData: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Custom Node Component
interface CustomNodeData {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  status?: 'pending' | 'active' | 'completed';
  hasInput?: boolean;
  inputValue?: string;
  inputLabel?: string;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  const IconComponent = data.icon;
  
  return (
    <div className={`min-w-[280px] bg-card rounded-lg border-2 shadow-lg transition-all duration-200 hover:shadow-xl ${
      data.status === 'active' 
        ? 'border-primary shadow-primary/20' 
        : data.status === 'completed'
        ? 'border-primary shadow-primary/20'
        : 'bg-muted'
    }`}>
      <div className="p-4">
        <div className="mb-3 text-center">
          <input 
            className="w-full text-center font-semibold bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white"
            defaultValue={data.title}
            placeholder="Enter title..."
          />
        </div>
        
        {data.hasInput && (
          <div className="mb-3">
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {data.inputLabel}
            </label>
            <Input 
              value={data.inputValue} 
              className="mt-1"
              readOnly
            />
          </div>
        )}
        
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
            Description
          </p>
          <textarea 
            className="w-full text-sm p-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-black"
            rows={4}
            placeholder="Enter your description here..."
            defaultValue={data.description || ''}
          />
        </div>
      </div>
      
      {/* Connection handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          width: 16, 
          height: 16, 
          backgroundColor: '#60a5fa',
          border: '2px solid white',
          borderRadius: '50%'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          width: 16, 
          height: 16, 
          backgroundColor: '#60a5fa',
          border: '2px solid white',
          borderRadius: '50%'
        }} 
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const StoryboardFlow = ({ onLogoClick, onGenerateVideo }: StoryboardFlowProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storyboardData, setStoryboardData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi there! I\'m here to help you with your Amazon shopping workflow storyboard. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 250;
    const maxWidth = 600;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  // Calculate center position for nodes based on canvas width
  const getCanvasCenterX = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const canvasWidth = screenWidth - sidebarWidth;
    return canvasWidth / 2;
  };
  
  const centerX = getCanvasCenterX();
  
  // Convert storyboard scenes to React Flow nodes
  const convertStoryboardToNodes = (storyboard: any): Node[] => {
    if (!storyboard?.scenes) return [];
    
    return storyboard.scenes.map((scene: any, index: number) => ({
      id: scene.id || `scene-${index}`,
      type: 'custom',
      position: { x: centerX, y: index * 200 },
      data: {
        title: scene.title || `Scene ${index + 1}`,
        objective: scene.narration || 'Scene description',
        icon: Video, // Default icon, could be customized based on scene type
        status: 'completed',
        hasInput: false,
        sceneData: scene
      },
    }));
  };
  
  const initialNodes: Node[] = [
    {
      id: 'scene1',
      type: 'custom',
      position: { x: centerX, y: 350 },
      data: {
        title: 'Landing on Amazon Home',
        description: "Navigate to Amazon's homepage and verify the home page is loaded.",
        icon: Settings,
        status: 'completed'
      },
    },
    {
      id: 'scene2',
      type: 'custom',
      position: { x: centerX, y: 600 },
      data: {
        title: 'Searching for Goose Plushie',
        description: "Go to the search bar and search for 'goose plushie'.",
        icon: Settings,
        status: 'completed'
      },
    },
    {
      id: 'scene3',
      type: 'custom',
      position: { x: centerX, y: 850 },
      data: {
        title: 'Selecting Product',
        description: "Select the first product in the search results that matches the search query.",
        icon: Settings,
        status: 'completed'
      },
    },
    {
      id: 'scene4',
      type: 'custom',
      position: { x: centerX, y: 1100 },
      data: {
        title: 'Add to Cart',
        description: "Check the reviews for the product and then add the product to the cart.",
        icon: Settings,
        status: 'completed'
      },
    },
    {
      id: 'scene5',
      type: 'custom',
      position: { x: centerX, y: 1350 },
      data: {
        title: 'View Cart',
        description: "View the cart and verify the product is in the cart.",
        icon: Settings,
        status: 'completed'
      },
    },
    {
      id: 'scene6',
      type: 'custom',
      position: { x: centerX, y: 1600 },
      data: {
        title: 'Wrap-Up',
        description: "Summarize the actions and verify the product is ready for checkout.",
        icon: Settings,
        status: 'active'
      },
    },
  ];
  
  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: 'scene1',
      target: 'scene2',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e2-3',
      source: 'scene2',
      target: 'scene3',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e3-4',
      source: 'scene3',
      target: 'scene4',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e4-5',
      source: 'scene4',
      target: 'scene5',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e5-6',
      source: 'scene5',
      target: 'scene6',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes when storyboard data is loaded
  useEffect(() => {
    if (storyboardData) {
      const storyboardNodes = convertStoryboardToNodes(storyboardData);
      if (storyboardNodes.length > 0) {
        setNodes(storyboardNodes);
        
        // Create edges between consecutive scenes
        const storyboardEdges: Edge[] = [];
        for (let i = 0; i < storyboardNodes.length - 1; i++) {
          storyboardEdges.push({
            id: `e-${storyboardNodes[i].id}-${storyboardNodes[i + 1].id}`,
            source: storyboardNodes[i].id,
            target: storyboardNodes[i + 1].id,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: '#ffffff',
              strokeWidth: 4,
            },
          });
        }
        setEdges(storyboardEdges);
      }
    }
  }, [storyboardData]);
  
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    
    
    try {
      const apiKey = import.meta.env.VITE_COHERE_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_COHERE_API_KEY') {
        // Fallback for when API key is not set - provide a helpful response
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I'd be happy to help you with "${currentMessage}". However, to provide you with the best AI-powered responses, please set up your Cohere API key in the environment variables. For now, I can tell you that this is a storyboard workflow for video creation where you can plan and organize your video scenes. Each node represents a different step in your video creation process.`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiResponse]);
        return;
      }

      // Call Cohere API directly
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `You are a helpful AI assistant for the One Take video creation platform. You can help users with:

1. Questions about the current workflow and storyboard
2. Video creation and content planning
3. Understanding how the application works
4. General questions about what's happening in the interface
5. Workflow automation and storyboard design
6. Any other questions users might have

CURRENT STORYBOARD CONTEXT:
The user is working on an Amazon shopping workflow storyboard with the following scenes:

Scene 1: "Landing on Amazon Home" - Navigate to Amazon's homepage and verify the home page is loaded.
Scene 2: "Searching for Goose Plushie" - Go to the search bar and search for 'goose plushie'.
Scene 3: "Selecting Product" - Select the first product in the search results that matches the search query.
Scene 4: "Add to Cart" - Check the reviews for the product and then add the product to the cart.
Scene 5: "View Cart" - View the cart and verify the product is in the cart.
Scene 6: "Wrap-Up" - Summarize the actions and verify the product is ready for checkout.

This is a step-by-step Amazon shopping tutorial workflow for purchasing a goose plushie. Each scene represents a different action in the shopping process, from landing on Amazon to completing the purchase preparation.

Be helpful, friendly, and informative. You can answer questions about this specific Amazon shopping workflow, the individual scenes, how they work together, or any modifications the user might want to make.

User: ${currentMessage}

Assistant:`,
          max_tokens: 500,
          temperature: 0.7,
          stop_sequences: ['User:', 'Assistant:']
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cohere API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Cohere API Response:', data);
      
      const aiResponse = data.generations?.[0]?.text?.trim() || 'I apologize, but I cannot provide a response at this time.';
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Cohere API:', error);
      
      // More helpful fallback response
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'd love to help you with "${currentMessage}", but I'm having trouble connecting to the AI service right now. This could be due to a missing API key or network issue. You can still use this storyboard to plan your video workflow - each node represents a step in your video creation process.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    }
  };

  const handleGenerateVideo = () => {
    const storyboardData = {
      nodes,
      edges,
      messages: chatMessages,
      generatedAt: new Date().toISOString()
    };
    onGenerateVideo?.(storyboardData);
  };
  
  const addNewNode = () => {
    const newId = String(nodes.length + 1);
    const lastNodeId = String(nodes.length);
    
    const newNode: Node = {
      id: newId,
      type: 'custom',
      position: { x: centerX, y: nodes.length * 150 + 50 },
      data: {
        title: `Action ${nodes.length}`,
        objective: 'New action objective',
        icon: Settings,
        status: 'completed'
      },
    };
    
    const newEdge: Edge = {
      id: `e${lastNodeId}-${newId}`,
      source: lastNodeId,
      target: newId,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };
  
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };
  
  const handleRunWorkflow = () => {
    // Navigate to video results page with workflow data
    const workflowData = {
      nodes,
      edges,
      messages: chatMessages,
      generatedAt: new Date().toISOString(),
      videoUrl: '/storyboard-creation/examples/AmazonCartDemo.mp4',
      title: 'Amazon Cart Demo Video',
      description: 'A step-by-step demonstration of the Amazon shopping workflow for purchasing a goose plushie'
    };
    
    // Navigate to video results with the workflow data
    navigate('/video-results', { 
      state: { 
        videoData: { 
          title: 'Amazon Cart Demo Video',
          videoUrl: '/storyboard-creation/examples/AmazonCartDemo.mp4',
          description: 'A step-by-step demonstration of the Amazon shopping workflow for purchasing a goose plushie'
        } 
      } 
    });
  };

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
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]"></div>
      
      <div className="h-screen relative z-10">
        <div className="h-full">
          {/* Header */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo on the left */}
              <div>
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted transition-all duration-200 px-3 py-2 rounded-lg"
                  onClick={onLogoClick}
                  title="Back to Home"
                >
                  <img 
                    src={LOGO} 
                    alt="One Take Logo" 
                    className="h-8 w-12"
                  />
                  <span className="font-bold text-lg">
                    ONE TAKE
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="text-sm border-border hover:bg-muted">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  onClick={handleRunWorkflow}
                  className="bg-white text-background hover:bg-white/90 text-sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
            {/* Left Sidebar */}
            <div 
              className="bg-card border-r border-border flex flex-col relative"
              style={{ width: `${sidebarWidth}px` }}
            >
              {/* Chat Section - Full Height */}
              <div className="h-full p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                
                {/* Messages - Takes up all available space */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="text-sm bg-muted p-3 rounded-lg">
                      {message.content}
                    </div>
                  ))}
                </div>
                
                {/* Input - Fixed at bottom of chat */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message here. Not sure where to start? Just ask!"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 text-sm"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Resize Handle */}
              <div
                className="absolute top-0 right-0 w-1 h-full bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
                onMouseDown={handleMouseDown}
                style={{ 
                  cursor: isResizing ? 'col-resize' : 'col-resize',
                  backgroundColor: isResizing ? 'hsl(var(--primary))' : undefined
                }}
              />
            </div>

            {/* Main Canvas */}
            <div 
              className="flex-1 relative"
              style={{
                backgroundImage: `url(${heroBg})`,
                backgroundSize: '2000%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="w-full h-full relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{
                    padding: 0.2,
                    includeHiddenNodes: false,
                  }}
                  className="bg-transparent"
                  style={{ width: '100%', height: '100%' }}
                  defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: false,
                    style: {
                      stroke: '#ffffff',
                      strokeWidth: 4,
                      strokeDasharray: 'none',
                    },
                  }}
                  proOptions={{ hideAttribution: true }}
                >
                  <Controls className="bg-card border border-border rounded-lg shadow-sm" />
                  <MiniMap className="bg-card border border-border rounded" nodeColor="hsl(var(--primary))" />
                  <Background variant={'dots' as any} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
                </ReactFlow>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={addNewNode}
                    className="bg-card border-border hover:bg-muted"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Node
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
