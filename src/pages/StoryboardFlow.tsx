import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  objective: string;
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
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${
            data.status === 'active' 
              ? 'bg-primary/20 text-primary' 
              : data.status === 'completed'
              ? 'bg-primary/20 text-primary'
              : 'bg-muted'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <h3 className="font-semibold">{data.title}</h3>
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
        
        {data.objective && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Objective
            </p>
            <p className="text-sm leading-relaxed">
              {data.objective}
            </p>
          </div>
        )}
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Of course! Here is a workflow that will get your emails from the last 24 hours, summarize them with AI, and send the summary to Slack.',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'ai',
      content: 'I\'ve set the default channel to "#general", which you can change if you\'d like.',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  // Calculate center position for nodes based on canvas width
  // Sidebar is 320px (w-80), so we center in the remaining space
  const getCanvasCenterX = () => {
    const sidebarWidth = 320;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const canvasWidth = screenWidth - sidebarWidth;
    return canvasWidth / 2;
  };
  
  const centerX = getCanvasCenterX();
  
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'custom',
      position: { x: centerX, y: 0 },
      data: {
        title: 'Gmail',
        objective: 'Get all emails received in the last 24 hours',
        icon: Mail,
        status: 'completed'
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: centerX, y: 200 },
      data: {
        title: 'Gmail',
        objective: 'Get all emails received in the last 24 hours',
        icon: Mail,
        status: 'completed'
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: centerX, y: 400 },
      data: {
        title: 'AI Call',
        objective: 'Summarize the provided emails into a concise report, highlighting key points and any action items',
        icon: Brain,
        status: 'completed'
      },
    },
    {
      id: '4',
      type: 'custom',
      position: { x: centerX, y: 600 },
      data: {
        title: 'Send to Slack',
        objective: 'Post the AI-generated email summary to the specified Slack channel',
        icon: Hash,
        status: 'active'
      },
    },
  ];
  
  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#ffffff',
        strokeWidth: 4,
      },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
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
  
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your request. Let me update the storyboard workflow accordingly. The changes will be reflected in the flow diagram.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Sample video for demo
      title: 'Email Workflow Demo Video',
      description: 'A demo video showing your email workflow automation'
    };
    
    // Navigate to video results with the workflow data
    navigate('/video-results', { 
      state: { 
        videoData: { 
          title: 'Test Video',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        } 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen">
        <div className="h-full">
          {/* Header */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">New Workflow</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">What apps can I use?</span>
                </div>
              </div>
              
              {/* Logo in the center */}
              <div className="flex-1 flex justify-center">
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted transition-all duration-200 px-3 py-2 rounded-lg"
                  onClick={onLogoClick}
                  title="Back to Home"
                >
                  <Video className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">
                    TAKE ONE
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="text-sm border-border hover:bg-muted">
                  <Key className="w-4 h-4 mr-2" />
                  Credentials (2)
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
            <div className="w-80 bg-card border-r border-border flex flex-col">
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
            </div>

            {/* Main Canvas */}
            <div className="flex-1 bg-gray-800">
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
                  className="bg-gray-800"
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
