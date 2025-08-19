// app/api/chat/route.js
import { NextRequest, NextResponse } from 'next/server';

// If you're using OpenAI API, uncomment and configure:
// import OpenAI from 'openai';
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// If you're using Anthropic Claude API, uncomment and configure:
// import Anthropic from '@anthropic-ai/sdk';
// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, request_type } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    // Validate request type
    if (request_type !== 'user_prompt') {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 },
      );
    }

    // Log the incoming request (optional, for debugging)
    console.log(`Received prompt: ${prompt.substring(0, 100)}...`);
    /*
    // ==== OPTION 1: Simple Echo Response (for testing) ====
    // Uncomment this for a simple test response
    const echoResponse = {
      reply: `Echo: ${prompt}`,
      timestamp: new Date().toISOString(),
      request_type: request_type
    };
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(echoResponse);
    */
    // ==== OPTION 2: OpenAI Integration ====
    // Uncomment and configure this section if using OpenAI

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Explain how AI works in a few words',
      });
      console.log(response.text);
      const aiResponse = response.text
    //   const aiResponse = response.choices[0].message.content;

      return NextResponse.json({
        reply: aiResponse,
        timestamp: new Date().toISOString(),
        request_type: request_type,
        model: 'gpt-3.5-turbo',
      });
    } catch (aiError) {
      console.error('OpenAI API Error:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate AI response', details: aiError.message },
        { status: 500 },
      );
    }

    // ==== OPTION 3: Anthropic Claude Integration ====
    // Uncomment and configure this section if using Anthropic Claude
    /*
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229", // or claude-3-opus-20240229 for higher capability
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are a helpful assistant. Provide clear and concise responses.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const aiResponse = message.content[0].text;

      return NextResponse.json({
        reply: aiResponse,
        timestamp: new Date().toISOString(),
        request_type: request_type,
        model: "claude-3-sonnet-20240229"
      });

    } catch (aiError) {
      console.error('Anthropic API Error:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate AI response', details: aiError.message },
        { status: 500 }
      );
    }
    */

    // ==== OPTION 4: Custom AI Service Integration ====
    // Replace this with your own AI service API call
    /*
    try {
      const response = await fetch('YOUR_AI_SERVICE_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.YOUR_API_KEY}`,
        },
        body: JSON.stringify({
          message: prompt,
          // Add other parameters as needed by your service
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      return NextResponse.json({
        reply: data.response || data.message || 'No response received',
        timestamp: new Date().toISOString(),
        request_type: request_type
      });

    } catch (aiError) {
      console.error('AI Service Error:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate AI response', details: aiError.message },
        { status: 500 }
      );
    }
    */
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 },
    );
  }
}

// Handle GET requests (optional, for health checks)
export async function GET() {
  return NextResponse.json({
    status: 'Chat API is running',
    timestamp: new Date().toISOString(),
    endpoints: ['POST /api/chat'],
  });
}
