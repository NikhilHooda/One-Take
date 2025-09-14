const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface StoryboardRequest {
  githubUrl: string;
  websiteUrl?: string;
  specifications?: string;
}

export interface StoryboardResponse {
  success: boolean;
  storyboard: any;
  transcript: string;
  requestId: string;
  generatedAt: string;
}

export interface StoryboardError {
  error: string;
  details?: string;
}

export class StoryboardService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData: StoryboardError = await response.json();
      throw new Error(errorData.details || errorData.error || 'Request failed');
    }

    return response.json();
  }

  static async generateStoryboard(request: StoryboardRequest): Promise<StoryboardResponse> {
    return this.makeRequest<StoryboardResponse>('/api/generate-storyboard', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getStoryboard(id: string): Promise<StoryboardResponse> {
    return this.makeRequest<StoryboardResponse>(`/api/storyboard/${id}`);
  }

  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health');
  }
}
