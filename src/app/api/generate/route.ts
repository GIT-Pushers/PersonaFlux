/**
 * @fileoverview PersonaFlux AI Character Generation API Route
 * @description Advanced AI-powered NPC generation using Google Gemini 1.5 Flash
 * with multi-language support and contextual character development
 * * @author PersonaFlux Team
 * @version 1.1.0
 * @since 2025-08-08
 * * @requires @google/generative-ai ^0.24.1
 * @requires next ^15.4.6
 * @requires jsonrepair ^3.8.0
 * * Features:
 * - Multi-language character generation
 * - Advanced personality trait integration
 * - Contextual backstory creation
 * - Dynamic dialogue options
 * - Multiple ending scenarios
 * - Robust JSON parsing with error correction
 * - Input validation and sanitization
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair"; // 👈 **FIX 1: Import the jsonrepair library**

/**
 * Initialize Google Generative AI client with Gemini 1.5 Flash model
 * Configured for JSON response format to ensure structured character data
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Corrected model name from 2.5 to 1.5
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.8,
    topP: 0.95,
    maxOutputTokens: 2048,
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
 * * Leverages Google Gemini 1.5 Flash to create comprehensive character profiles
 * with personality-driven narratives, contextual backstories, and interactive elements.
 * * @param req - NextRequest containing character parameters
 * @returns Promise<NextResponse> - Generated character data or error response
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ... (Your validation code remains the same, it's already excellent)
    const requestBody: CharacterGenerationRequest = await req.json();
    const { character_name, traits, age, gender, language } = requestBody;

    if (!character_name?.trim()) {
      return NextResponse.json(
        { error: "Character name is required" },
        { status: 400 }
      );
    }
    // ... etc. for all your other validations

    const prompt = `
You are a multilingual AI story writer and character developer.

🧠 Your job is to generate an engaging, imaginative NPC character background and setup, based on user input.

🎯 OUTPUT FORMAT:
Your response must be a single valid JSON object in the following structure, using line breaks (\\n) inside values as needed:

{
  "backstory": "2–3 paragraphs about the character’s origin, motivations, and past life.",
  "story_context": "A 2-paragraph description of the current world/situation the character is in (sci-fi, fantasy, dystopia, etc.).",
  "starting_prompt": "A single sentence that begins the player's interaction with the character.",
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

    // 👇 **FIX 2: Add logging and repair the JSON before parsing**
    console.log("Raw AI Response Text:", text); // Log the raw output for easier debugging

    try {
      const repairedJsonString = jsonrepair(text); // Repair potential syntax errors
      const generatedJson = JSON.parse(repairedJsonString); // Parse the clean string
      return NextResponse.json(generatedJson);
    } catch (parseError) {
      console.error("Failed to parse JSON even after repair:", parseError);
      // Return a more specific error if parsing still fails
      return NextResponse.json(
        {
          error: "Failed to process AI response.",
          details:
            "The AI returned a malformed JSON object that could not be repaired.",
          rawOutput: text, // Send the raw output to the client for inspection
        },
        { status: 500 }
      );
    }
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
