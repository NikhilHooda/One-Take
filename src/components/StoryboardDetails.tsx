import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface StoryboardDetailsProps {
  storyboard: any;
  transcript?: string;
}

export const StoryboardDetails: React.FC<StoryboardDetailsProps> = ({ storyboard, transcript }) => {
  if (!storyboard) return null;

  return (
    <div className="space-y-4">
      {/* Storyboard Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Storyboard Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Name</label>
              <p className="text-lg font-semibold">{storyboard.product_name || 'Untitled'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Duration</label>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {storyboard.suggested_duration_seconds || 0}s
              </p>
            </div>
          </div>
          
          {storyboard.target_audience && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Target Audience</label>
              <p className="text-sm">{storyboard.target_audience}</p>
            </div>
          )}
          
          {storyboard.goal && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Goal</label>
              <p className="text-sm">{storyboard.goal}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Scenes ({storyboard.scenes?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {storyboard.scenes?.map((scene: any, index: number) => (
              <div key={scene.id || index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{scene.title || `Scene ${index + 1}`}</h4>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {scene.duration_seconds || 0}s
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scene.narration}</p>
                {scene.on_screen_text && (
                  <p className="text-xs bg-muted p-2 rounded">
                    <strong>On-screen text:</strong> {scene.on_screen_text}
                  </p>
                )}
                {scene.actions && scene.actions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Actions:</p>
                    <div className="space-y-1">
                      {scene.actions.map((action: any, actionIndex: number) => (
                        <div key={actionIndex} className="text-xs bg-muted/50 p-2 rounded">
                          <strong>{action.type}:</strong> {action.selector || action.notes || action.url}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coverage */}
      {storyboard.coverage && (
        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storyboard.coverage.features && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Features</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {storyboard.coverage.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
            {storyboard.coverage.buttons_clicked && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Buttons Clicked</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {storyboard.coverage.buttons_clicked.map((button: string, index: number) => (
                    <Badge key={index} variant="secondary">{button}</Badge>
                  ))}
                </div>
              </div>
            )}
            {storyboard.coverage.forms_tested && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Forms Tested</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {storyboard.coverage.forms_tested.map((form: string, index: number) => (
                    <Badge key={index} variant="outline">{form}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assumptions and Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storyboard.assumptions && storyboard.assumptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {storyboard.assumptions.map((assumption: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {assumption}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {storyboard.risks && storyboard.risks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {storyboard.risks.map((risk: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded">
              {transcript}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
