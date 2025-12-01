import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle, Upload, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { groqAPI } from '@/api/groqClient';

const AIGenerateProjectFields = ({ onGenerate, initialData = {} }) => {
  const [aiInputs, setAiInputs] = useState({
    githubUrl: initialData.githubUrl || '',
    liveDemoUrl: initialData.liveDemoUrl || '',
    userNotes: '',
  });
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `${file.name} is not a valid image. Please use JPEG, PNG, or WEBP.`,
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (screenshotFiles.length + files.length > 3) {
      toast({
        title: 'Too many files',
        description: 'You can upload up to 3 screenshots for AI analysis.',
        variant: 'destructive',
      });
      return;
    }

    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result,
          name: file.name,
        });
        
        if (newPreviews.length === validFiles.length) {
          setScreenshotFiles([...screenshotFiles, ...validFiles]);
          setScreenshotPreviews([...screenshotPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeScreenshot = (index) => {
    setScreenshotFiles(screenshotFiles.filter((_, i) => i !== index));
    setScreenshotPreviews(screenshotPreviews.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    // Validate at least one input is provided
    const hasInput =
      aiInputs.githubUrl.trim() ||
      aiInputs.liveDemoUrl.trim() ||
      screenshotFiles.length > 0 ||
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
      // Convert screenshot files to base64 for AI analysis
      const screenshotBase64 = await Promise.all(
        screenshotFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );

      const result = await groqAPI.generateProject({
        githubUrl: aiInputs.githubUrl.trim(),
        liveDemoUrl: aiInputs.liveDemoUrl.trim(),
        screenshotBase64: screenshotBase64,
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

        {/* Screenshot File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Screenshot Files
            <span className="text-xs text-muted-foreground">(AI vision will analyze images)</span>
          </label>

          {/* Upload Button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isGenerating}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload screenshots (up to 3 images)
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WEBP • Max 5MB each
              </p>
            </div>
          </div>

          {/* Preview Grid */}
          {screenshotPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {screenshotPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={preview.preview}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeScreenshot(index)}
                    disabled={isGenerating}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {preview.name}
                  </p>
                </div>
              ))}
            </div>
          )}
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
        <div className="flex items-start gap-2 p-3 bg-muted border rounded-md">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Upload screenshots of your project for AI to analyze visually. 
            The more information you provide, the better the AI can understand your project.
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
                Analyzing...
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