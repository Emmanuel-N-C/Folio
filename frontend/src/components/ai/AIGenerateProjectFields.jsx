import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import { groqAPI } from '@/api/groqClient';

const AIGenerateProjectFields = ({ onGenerate, initialData = {} }) => {
  const [aiInputs, setAiInputs] = useState({
    githubUrl: initialData.githubUrl || '',
    liveDemoUrl: initialData.liveDemoUrl || '',
    screenshotUrls: initialData.screenshotUrls || [''],
    userNotes: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    // Validate at least one input is provided
    const hasInput =
      aiInputs.githubUrl.trim() ||
      aiInputs.liveDemoUrl.trim() ||
      aiInputs.screenshotUrls.some(url => url.trim()) ||
      aiInputs.userNotes.trim();

    if (!hasInput) {
      toast({
        title: 'Input Required',
        description: 'Please provide at least one input (GitHub URL, Demo URL, screenshots, or notes)',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await groqAPI.generateProject({
        githubUrl: aiInputs.githubUrl.trim(),
        liveDemoUrl: aiInputs.liveDemoUrl.trim(),
        screenshotUrls: aiInputs.screenshotUrls.filter(url => url.trim()),
        userNotes: aiInputs.userNotes.trim(),
      });

      // Pass generated data to parent component
      onGenerate(result);

      toast({
        title: 'Success! ✨',
        description: 'AI has generated your project details. Review and edit as needed.',
      });

      // Collapse the AI form after successful generation
      setShowAIForm(false);
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate project details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addScreenshotUrl = () => {
    setAiInputs({
      ...aiInputs,
      screenshotUrls: [...aiInputs.screenshotUrls, ''],
    });
  };

  const removeScreenshotUrl = (index) => {
    setAiInputs({
      ...aiInputs,
      screenshotUrls: aiInputs.screenshotUrls.filter((_, i) => i !== index),
    });
  };

  const updateScreenshotUrl = (index, value) => {
    const newUrls = [...aiInputs.screenshotUrls];
    newUrls[index] = value;
    setAiInputs({ ...aiInputs, screenshotUrls: newUrls });
  };

  if (!showAIForm) {
    return (
      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Generate with AI ✨
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Let AI analyze your project and auto-fill the form
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setShowAIForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start AI Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Project Generator
        </CardTitle>
        <p className="text-sm text-gray-600">
          Provide any combination of inputs below, and AI will generate your project details
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GitHub URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span>GitHub Repository URL</span>
            <span className="text-xs text-gray-500">(AI will read README)</span>
          </label>
          <Input
            type="url"
            placeholder="https://github.com/username/project"
            value={aiInputs.githubUrl}
            onChange={(e) => setAiInputs({ ...aiInputs, githubUrl: e.target.value })}
            disabled={isGenerating}
          />
        </div>

        {/* Live Demo URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span>Live Demo URL</span>
            <span className="text-xs text-gray-500">(AI will analyze the site)</span>
          </label>
          <Input
            type="url"
            placeholder="https://myproject.vercel.app"
            value={aiInputs.liveDemoUrl}
            onChange={(e) => setAiInputs({ ...aiInputs, liveDemoUrl: e.target.value })}
            disabled={isGenerating}
          />
        </div>

        {/* Screenshot URLs */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Screenshot URLs</span>
            <span className="text-xs text-gray-500">(AI vision will analyze images)</span>
          </label>
          {aiInputs.screenshotUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://imgur.com/screenshot.png or direct image URL"
                value={url}
                onChange={(e) => updateScreenshotUrl(index, e.target.value)}
                disabled={isGenerating}
              />
              {aiInputs.screenshotUrls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeScreenshotUrl(index)}
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addScreenshotUrl}
            disabled={isGenerating}
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Screenshot URL
          </Button>
        </div>

        {/* User Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Additional Notes (Optional)
          </label>
          <Textarea
            placeholder="Add any context about your project: features, goals, unique aspects..."
            value={aiInputs.userNotes}
            onChange={(e) => setAiInputs({ ...aiInputs, userNotes: e.target.value })}
            rows={3}
            disabled={isGenerating}
          />
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> The more information you provide, the better the AI can understand your project. 
            You can provide any combination of GitHub URL, demo URL, screenshots, or notes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Project Details
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAIForm(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIGenerateProjectFields;