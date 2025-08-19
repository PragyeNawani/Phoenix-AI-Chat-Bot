// app/api/chat/route.js
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate a title based on the prompt
async function generateTitle(prompt, model) {
  try {
    const titlePrompt = `Generate a short, concise title (maximum 6-8 words) that captures the main topic or question in this prompt: "${prompt}". Return only the title, no additional text or quotes.`;
    
    const result = await model.generateContent(titlePrompt);
    const response = result.response;
    let title = response.text().trim();
    
    // Clean up the title (remove quotes if present)
    title = title.replace(/^["']|["']$/g, '');
    
    // Fallback if title is too long or empty
    if (!title || title.length > 50) {
      // Extract first few words from the original prompt as fallback
      const words = prompt.trim().split(' ').slice(0, 6);
      title = words.join(' ');
      if (title.length > 40) {
        title = title.substring(0, 40) + '...';
      }
    }
    
    return title;
  } catch (error) {
    console.error('Title generation error:', error);
    // Fallback title generation
    const words = prompt.trim().split(' ').slice(0, 5);
    return words.join(' ').substring(0, 40);
  }
}

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, request_type } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate request type
    if (request_type !== 'user_prompt') {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Log the incoming request (optional, for debugging)
    console.log(`Received prompt: ${prompt.substring(0, 100)}...`);

    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // You can also use "gemini-1.5-pro" for better quality
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      });

      // Generate both title and content concurrently
      const [titlePromise, contentPromise] = await Promise.allSettled([
        generateTitle(prompt, model),
        model.generateContent(prompt)
      ]);

      // Handle content generation result
      if (contentPromise.status === 'rejected') {
        throw contentPromise.reason;
      }

      const result = contentPromise.value;
      const response = result.response;
      const aiResponse = response.text();

      // Handle title generation result
      let title = 'Chat Response';
      if (titlePromise.status === 'fulfilled') {
        title = titlePromise.value;
      }

      // Check if the response was blocked by safety filters
      if (!aiResponse || aiResponse.trim().length === 0) {
        return NextResponse.json({
          reply: "I apologize, but I couldn't generate a response for that request. Please try rephrasing your question.",
          title: title,
          timestamp: new Date().toISOString(),
          request_type: request_type,
          model: "gemini-1.5-flash",
          blocked: true
        });
      }

      return NextResponse.json({
        reply: aiResponse,
        title: title,
        timestamp: new Date().toISOString(),
        request_type: request_type,
        model: "gemini-1.5-flash", // Fixed the typo from "gemini-2.5-flash"
        blocked: false
      });

    } catch (geminiError) {
      console.error('Gemini AI Error:', geminiError);
      
      // Generate fallback title even on error
      const fallbackTitle = prompt.trim().split(' ').slice(0, 5).join(' ').substring(0, 40);
      
      // Handle specific Gemini errors
      if (geminiError.message?.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Gemini API configuration.' },
          { status: 401 }
        );
      }
      
      if (geminiError.message?.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (geminiError.message?.includes('SAFETY')) {
        return NextResponse.json({
          reply: "I apologize, but I couldn't generate a response due to safety guidelines. Please try rephrasing your question.",
          title: fallbackTitle,
          timestamp: new Date().toISOString(),
          request_type: request_type,
          model: "gemini-1.5-flash",
          blocked: true
        });
      }

      return NextResponse.json(
        { error: 'Failed to generate AI response', details: geminiError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Handle GET requests (for health checks)
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'Chat API is running',
    service: 'Google Gemini AI',
    model: 'gemini-1.5-flash',
    apiKeyConfigured: hasApiKey,
    timestamp: new Date().toISOString(),
    endpoints: ['POST /api/chat'],
    features: ['AI Response Generation', 'Dynamic Title Generation']
  });
}