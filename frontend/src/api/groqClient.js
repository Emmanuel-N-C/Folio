// Groq API Client for AI-powered project generation
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Available Groq models
const MODELS = {
  LLAMA_90B: 'llama-3.3-70b-versatile', // Best for complex reasoning
  LLAMA_8B: 'llama-3.1-8b-instant', // Fast for simple tasks
  VISION: 'llama-3.2-90b-vision-preview', // For image analysis
};

/**
 * Fetch README content from GitHub repository
 */
async function fetchGitHubReadme(githubUrl) {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace('.git', '');
    
    const readmeUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/readme`;
    const response = await fetch(readmeUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    return null;
  }
}

/**
 * Fetch HTML content from deployed URL
 */
async function fetchDeployedSiteContent(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    
    return {
      title: titleMatch ? titleMatch[1] : null,
      description: descMatch ? descMatch[1] : null,
      hasContent: true,
    };
  } catch (error) {
    console.error('Error fetching deployed site:', error);
    return null;
  }
}

/**
 * Analyze screenshots using Groq's vision model (base64 images)
 */
async function analyzeScreenshots(screenshotBase64) {
  if (!screenshotBase64 || screenshotBase64.length === 0) return null;

  try {
    // Build image messages with base64 data
    const imageMessages = screenshotBase64.map(base64Data => ({
      type: 'image_url',
      image_url: {
        url: base64Data, // Base64 data URL (data:image/png;base64,...)
      },
    }));

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELS.VISION,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze these project screenshots in detail. Describe: 1) What type of application/website this is, 2) All visible features and functionality, 3) UI/UX design style and color scheme, 4) Likely technologies and frameworks used based on the design patterns, 5) Target audience or use case. Be thorough and specific.',
              },
              ...imageMessages,
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error analyzing screenshots:', error);
    throw error; // Propagate error to show user
  }
}

/**
 * Generate project details using Groq AI
 */
export async function generateProjectWithAI({
  githubUrl = '',
  liveDemoUrl = '',
  screenshotBase64 = [],
  userNotes = '',
}) {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY is not configured');
  }

  try {
    // Gather context from all sources
    const context = {
      readme: githubUrl ? await fetchGitHubReadme(githubUrl) : null,
      deployedSite: liveDemoUrl ? await fetchDeployedSiteContent(liveDemoUrl) : null,
      screenshotAnalysis: screenshotBase64.length > 0 ? await analyzeScreenshots(screenshotBase64) : null,
      userNotes,
    };

    // Build comprehensive prompt
    const prompt = buildPrompt(context, githubUrl, liveDemoUrl);

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELS.LLAMA_90B,
        messages: [
          {
            role: 'system',
            content: 'You are a technical writer who creates compelling project descriptions for developer portfolios. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse and validate JSON response
    const result = JSON.parse(content);
    return validateAndFormatResponse(result);
  } catch (error) {
    console.error('Error generating project with AI:', error);
    throw error;
  }
}

/**
 * Build comprehensive prompt from gathered context
 */
function buildPrompt(context, githubUrl, liveDemoUrl) {
  let prompt = 'Generate a compelling project description based on the following information:\n\n';

  if (context.readme) {
    prompt += `**GitHub README:**\n${context.readme.substring(0, 2000)}\n\n`;
  }

  if (context.deployedSite?.hasContent) {
    prompt += `**Deployed Site Info:**\n`;
    prompt += `Title: ${context.deployedSite.title}\n`;
    prompt += `Description: ${context.deployedSite.description}\n\n`;
  }

  if (context.screenshotAnalysis) {
    prompt += `**Visual Analysis from Screenshots:**\n${context.screenshotAnalysis}\n\n`;
  }

  if (context.userNotes) {
    prompt += `**User Notes:**\n${context.userNotes}\n\n`;
  }

  if (githubUrl) {
    prompt += `**GitHub URL:** ${githubUrl}\n`;
  }

  if (liveDemoUrl) {
    prompt += `**Live Demo URL:** ${liveDemoUrl}\n`;
  }

  prompt += `\n**Task:** Create a professional project description in JSON format with these exact fields:

{
  "projectTitle": "A clear, catchy title (50 chars max)",
  "description": "A detailed 2-3 paragraph description explaining what the project does, key features, and its purpose (300-500 words)",
  "techStack": ["Technology1", "Technology2", "Technology3"],
  "tags": ["tag1", "tag2", "tag3"],
  "previewSummary": "A one-sentence hook for the project card (100 chars max)",
  "simpleExplanation": "Explain what this project does in simple terms, as if to a non-technical person (150 words max)"
}

**Requirements:**
- Be accurate based on the provided context
- Don't hallucinate features that aren't mentioned
- Use professional, engaging language
- Make the description compelling for a portfolio
- Include 4-6 relevant tech stack items
- Include 3-5 relevant tags
- Ensure all fields are populated
- Return ONLY valid JSON, no markdown or extra text`;

  return prompt;
}

/**
 * Validate and format the AI response
 */
function validateAndFormatResponse(result) {
  const formatted = {
    projectTitle: result.projectTitle || result.title || 'Untitled Project',
    description: result.description || '',
    techStack: Array.isArray(result.techStack) ? result.techStack : [],
    tags: Array.isArray(result.tags) ? result.tags : [],
    previewSummary: result.previewSummary || result.summary || '',
    simpleExplanation: result.simpleExplanation || result.explanation || '',
  };

  // Ensure arrays are not empty
  if (formatted.techStack.length === 0) {
    formatted.techStack = ['JavaScript'];
  }

  if (formatted.tags.length === 0) {
    formatted.tags = ['web'];
  }

  return formatted;
}

export const groqAPI = {
  generateProject: generateProjectWithAI,
  models: MODELS,
};