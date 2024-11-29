import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Ensure environment variables are set
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    const fullPrompt = `CRITICAL GAME COMPONENT GENERATION INSTRUCTIONS:
1. Create a PURE React functional component
2. ABSOLUTELY NO import statements
3. Use ONLY React.useState, NO other React hooks
4. Component MUST be named exactly 'GameComponent'
5. Return valid JSX with ONLY standard HTML elements
6. Include all game logic INSIDE the component function
7. NO external dependencies or libraries
8. NO export keywords
9. WRAP entire code in these EXACT markers:


function GameComponent() {
  // Your complete component code here
  return (...);
}


Game Description: ${prompt}

CRITICAL: Return ONLY the component code within THESE EXACT markers.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: "You are an expert React game component generator. Generate PURE React components with NO imports, NO external dependencies, ONLY core React functionality."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const generatedCode = completion.choices[0]?.message?.content?.trim() || '';

    // Additional validation
    if (!generatedCode) {
      return NextResponse.json(
        { error: 'Failed to generate game code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Game generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate game', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';