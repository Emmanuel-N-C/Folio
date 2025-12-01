import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { groqAPI } from '@/api/groqClient';

const AIGenerateProjectFields = ({ onGenerate, initialData = {} }) => {
  const [aiInputs, setAiInputs] = useState({
    githubUrl: initialData.githubUrl || '',
    liveDemoUrl: initialData.liveDemoUrl || '',
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
      aiInputs.userNotes.trim();

    if (!hasInput) {
      toast({
        title: 'Input Required',
        description: 'Please provide at least one input (GitHub URL, Demo URL, or notes)',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await groqAPI.generateProject({
        githubUrl: aiInputs.githubUrl.trim(),
        liveDemoUrl: aiInputs.liveDemoUrl.trim(),
        userNotes: aiInputs.userNotes.trim(),
      });

      // Pass generated data to parent component
      onGenerate(result);

      toast({
        title: 'Success',
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

  if (!showAIForm) {
    return (
      <Card className="border-2 border-dashed hover:shadow-lg transition-all">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Generate with AI
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              Let AI analyze your project and auto-fill the form
            </p>
            <Button
              type="button"
              onClick={() => setShowAIForm(true)}
              variant="outline"
              size="sm"
            >
              Start AI Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Project Generator</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowAIForm(false)}
            disabled={isGenerating}
          >
            {showAIForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Provide any combination of inputs below, and AI will generate your project details
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GitHub URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            GitHub Repository URL
            <span className="text-xs text-muted-foreground ml-2">(AI will read README)</span>
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
          <label className="text-sm font-medium">
            Live Demo URL
            <span className="text-xs text-muted-foreground ml-2">(AI will analyze the site)</span>
          </label>
          <Input
            type="url"
            placeholder="https://myproject.vercel.app"
            value={aiInputs.liveDemoUrl}
            onChange={(e) => setAiInputs({ ...aiInputs, liveDemoUrl: e.target.value })}
            disabled={isGenerating}
          />
        </div>

        {/* User Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Project Description / Notes
          </label>
          <Textarea
            placeholder="Describe your project: What does it do? What features does it have? What technologies did you use? What problems does it solve?"
            value={aiInputs.userNotes}
            onChange={(e) => setAiInputs({ ...aiInputs, userNotes: e.target.value })}
            rows={5}
            disabled={isGenerating}
          />
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-muted border rounded-md">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> The more information you provide, the better the AI can understand your project. 
            Include details about features, tech stack, and what makes your project unique.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Project Details'
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