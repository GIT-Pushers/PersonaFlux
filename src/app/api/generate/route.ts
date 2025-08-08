/**
 * @fileoverview PersonaFlux AI Character Generation API Route
 * @description Advanced AI-powered NPC generation using Google Gemini 1.5 Flash
 * with multi-language support and contextual character development
 * 
 * @author PersonaFlux Team
 * @version 1.0.0
 * @since 2025-08-08
 * 
 * @requires @google/generative-ai ^0.24.1
 * @requires next ^15.4.6
 * 
 * Features:
 * - Multi-language character generation
 * - Advanced personality trait integration
 * - Contextual backstory creation
 * - Dynamic dialogue options
 * - Multiple ending scenarios
 * - Comprehensive error handling
 * - Input validation and sanitization
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * Initialize Google Generative AI client with Gemini 1.5 Flash model
 * Configured for JSON response format to ensure structured character data
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.8, // Balanced creativity and consistency
    topP: 0.95,      // High diversity in token selection
    maxOutputTokens: 2048, // Sufficient for detailed character data
  },
});

/**
 * Interface for character generation request payload
 */
interface CharacterGenerationRequest {
  character_name: string;
  traits: string[];
  age?: number;
  gender: string;
  language: string;
}

/**
 * POST /api/generate - Generate AI-powered NPC character
 * 
 * Leverages Google Gemini 1.5 Flash to create comprehensive character profiles
 * with personality-driven narratives, contextual backstories, and interactive elements.
 * 
 * @param req - NextRequest containing character parameters
 * @returns Promise<NextResponse> - Generated character data or error response
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/generate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     character_name: "Aria Shadowmere",
 *     traits: ["mysterious", "intelligent", "brave"],
 *     age: 28,
 *     gender: "female",
 *     language: "English"
 *   })
 * });
 * ```
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract and validate request payload
    const requestBody: CharacterGenerationRequest = await req.json();
    const { character_name, traits, age, gender, language } = requestBody;

    // Input validation with detailed error messages
    if (!character_name?.trim()) {
      return NextResponse.json(
        { 
          error: "Character name is required",
          details: "Please provide a valid character name (minimum 1 character)" 
        },
        { status: 400 }
      );
    }

    if (!traits || !Array.isArray(traits) || traits.length === 0) {
      return NextResponse.json(
        { 
          error: "Character traits are required",
          details: "Please select at least one personality trait" 
        },
        { status: 400 }
      );
    }

    if (!gender?.trim()) {
      return NextResponse.json(
        { 
          error: "Character gender is required",
          details: "Please specify character gender" 
        },
        { status: 400 }
      );
    }

    if (!language?.trim()) {
      return NextResponse.json(
        { 
          error: "Language is required",
          details: "Please specify the generation language" 
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a multilingual AI story writer and character developer.

🧠 Your job is to generate an engaging, imaginative NPC character background and setup, based on user input.

🎯 OUTPUT FORMAT:
Your response must be a single valid JSON object in the following structure, using line breaks (\\n) inside values as needed:

{
  "backstory": "2–3 paragraphs about the character’s origin, motivations, and past life.",
  "story_context": "A 2-paragraph description of the current world/situation the character is in (sci-fi, fantasy, dystopia, etc.).",
  "starting_propt": "A single sentence that begins the player's interaction with the character.",
  "start_options": [
    "First possible player choice or reply",
    "Second creative alternative",
    "Third mysterious or cautious reply"
  ],
  "ending_scenes": [
    "A happy or triumphant ending",
    "A tragic or emotional ending",
    "An ambiguous or philosophical ending"
  ]
}

📌 CHARACTER PROFILE:
- Name: ${character_name}
- Traits: ${traits.join(", ")}
- Age: ${age || "Unknown"}
- Gender: ${gender}

🌍 LANGUAGE:
Generate the entire output in: ${language}

Do not write anything outside the JSON object. Return only the JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const generatedJson = JSON.parse(text);
    return NextResponse.json(generatedJson);
  } catch (error) {
    console.error("Error in /api/generate route:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to generate story.", details: message },
      { status: 500 }
    );
  }
}
