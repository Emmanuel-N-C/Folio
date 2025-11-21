import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
})

export const aiAPI = {
  // Generate post suggestions based on user's tech stack
  generatePostSuggestions: async (techStack) => {
    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate 3 creative project ideas for a developer portfolio using these technologies: ${techStack}. 
        Format as JSON array with: title, description, techStack, and estimatedTime.`,
      })
      return JSON.parse(text)
    } catch (error) {
      console.error('AI Error:', error)
      throw error
    }
  },

  // AI code review for GitHub repositories
  reviewCode: async (githubUrl) => {
    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Provide a brief code review summary for this GitHub repository: ${githubUrl}. 
        Include: strengths, areas for improvement, and tech stack analysis.`,
      })
      return text
    } catch (error) {
      console.error('AI Error:', error)
      throw error
    }
  },

  // Stream AI chatbot responses
  streamChatResponse: async (messages) => {
    try {
      const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages: messages,
      })
      return result.toAIStream()
    } catch (error) {
      console.error('AI Error:', error)
      throw error
    }
  },

  // Generate profile bio suggestions
  generateBio: async (username, skills) => {
    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate a professional developer bio for ${username} with these skills: ${skills}. 
        Keep it under 150 characters, engaging and professional.`,
      })
      return text
    } catch (error) {
      console.error('AI Error:', error)
      throw error
    }
  },
}