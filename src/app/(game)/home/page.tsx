"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useChar } from "@/store/useChar";
import NPCBubble from "@/components/NpcBubble";
import { getCharacterById } from "@/service/service";

// Types
interface Character {
  id: number;
  character_name: string;
  avatar_url: string | null;
  traits: string[];
  backstory: string;
  story_context: string;
  starting_propt?: string;
  start_options: string[];
  no_of_scenes: number;
}

const Home = () => {
  const [currentImage, setCurrentImage] = useState(2);

  const { isDraggable } = useChar();

  // Chat/Story Game State
  const [character, setCharacter] = useState<Character | null>(null);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Loading and Error States
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock character data (replace with Supabase fetch)
  const mockCharacter: Character = {
    id: 1,
    character_name: "Aria the Brave",
    avatar_url: "/male/male1/char.png",
    traits: ["brave", "witty", "charismatic"],
    backstory:
      "A fearless warrior who has traveled across many realms seeking adventure and justice.",
    story_context:
      "Standing at the entrance of an ancient dungeon, rumors of treasure and danger echo in the air.",
    starting_propt:
      "The ancient stone door creaks open, revealing darkness beyond. A cold wind carries whispers of forgotten secrets.",
    start_options: [
      "Light a torch and step boldly into the darkness",
      "Listen carefully to the whispers before proceeding",
      "Search the entrance for any clues or traps",
    ],
    no_of_scenes: 10,
  };

  // Fetch character from Supabase
  const fetchCharacterFromSupabase = async (characterId: number) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log(`🔍 Fetching character with ID: ${characterId}`);
      const { data, error: fetchError } = await getCharacterById(characterId);

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        console.log("✅ Character fetched from Supabase:", data);
        const supabaseCharacter: Character = {
          id: data.id,
          character_name: data.character_name,
          avatar_url: data.avatar_url || null,
          traits: data.traits || [],
          backstory: data.backstory || "No backstory available.",
          story_context: data.story_context || "The adventure begins...",
          starting_propt: data.starting_propt || "Your story starts here...", // Use correct field name
          start_options: data.start_options || [
            "Continue",
            "Look around",
            "Wait",
          ],
          no_of_scenes: data.no_of_scenes || 5,
        };
        return supabaseCharacter;
      } else {
        throw new Error("Character not found");
      }
    } catch (err) {
      console.error("❌ Failed to fetch character:", err);
      setError(
        `Failed to load character: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize game with mock character or fetch from Supabase
  const startGame = async (characterId?: number) => {
    let gameCharacter: Character | null = null;

    if (characterId) {
      // Fetch from Supabase
      gameCharacter = await fetchCharacterFromSupabase(characterId);
    } else {
      // Use mock character
      gameCharacter = mockCharacter;
      console.log("🎮 Using mock character for demo");
    }

    if (gameCharacter) {
      setCharacter(gameCharacter);
      setStoryHistory([
        gameCharacter.starting_propt || "The adventure begins...",
      ]);
      setCurrentOptions(gameCharacter.start_options || []);
      setIsGameStarted(true);
      setCurrentScene(1);
      setError(null);
    }
  };

  // Handle option selection and generate next scene
  const handleOptionSelect = async (selectedOption: string) => {
    if (!character || isGenerating) return;

    // Check for special ending options
    if (selectedOption === "End Adventure") {
      setIsGameStarted(false);
      setCharacter(null);
      setStoryHistory([]);
      setCurrentOptions([]);
      setCurrentScene(1);
      return;
    }

    if (selectedOption === "Start New Adventure") {
      startGame();
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Prepare data for the AI API
      const requestData = {
        character_name: character.character_name,
        age: 25,
        gender: "Unknown",
        traits: character.traits,
        backstory: character.backstory,
        story_context: `${
          character.story_context
        }\n\nStory so far: ${storyHistory.slice(-2).join(" ")}`,
        voice_name: "Alloy",
        language: "English",
        starting_prompt: `The user chose: "${selectedOption}". Continue the story and provide 3 new choices.`,
      };

      console.log("🎮 Sending story continuation request:", requestData);

      const response = await fetch("/api/generate-npc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("🎮 Story continuation response:", result);

      if (result.success) {
        // Add user choice and AI response to story history
        const newStory = result.npc_dialogue.join(" ");
        setStoryHistory([
          ...storyHistory,
          `You chose: ${selectedOption}`,
          newStory,
        ]);
        setCurrentOptions(result.player_options || []);

        // Check if game should end
        if (currentScene >= character.no_of_scenes) {
          setCurrentOptions([
            "End Adventure",
            "Start New Adventure",
            "Continue Exploring",
          ]);
        } else {
          setCurrentScene(currentScene + 1);
        }
      } else {
        setError(result.error || "Failed to generate story continuation");
      }
    } catch (err) {
      console.error("❌ Story generation failed:", err);
      setError("Failed to generate next scene. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset game function
  const resetGame = () => {
    setIsGameStarted(false);
    setCharacter(null);
    setStoryHistory([]);
    setCurrentOptions([]);
    setCurrentScene(1);
    setError(null);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev >= 6 ? 1 : prev + 1));
  };

  return (
    <div className="flex h-screen w-screen">
      <section className="hero bg-amber-700 w-55/100 flex items-center justify-center relative overflow-hidden">
        <button
          className="absolute left-4 z-10 bg-transparent bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ArrowLeft />
        </button>
        <Image
          src={`/Summer${currentImage}.png`}
          alt={`Summer ${currentImage}`}
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0"
        />
        <button
          className="absolute right-4 z-10 bg-transparent bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ArrowRight />
        </button>
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 text-white text-center"
          drag={isDraggable}
          dragConstraints={{ top: -100, bottom: 100, left: -150, right: 150 }}
          dragElastic={0.1}
        >
          <NPCBubble message="Hello! How can I assist you today?" />
          <div
            className={`scale-[2.5] w-[128px] h-[128px] bg-no-repeat ${
              isDraggable ? "cursor-grab" : "cursor-default"
            }`}
            style={{
              animation: "idle 1s steps(6) infinite",
              backgroundSize: "auto",
              backgroundImage: `url('/male/male1/idle.png')`,
            }}
          >
            <style jsx>{`
              @keyframes idle {
                from {
                  background-position: 0px;
                }
                to {
                  background-position: -768px;
                }
              }
            `}</style>
          </div>
        </motion.div>
      </section>

      <section className="bg-gray-50 w-45/100 flex flex-col p-6">
        {/* Chat Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Interactive Story
            </h2>
            {isGameStarted && (
              <button
                onClick={resetGame}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
              >
                Reset
              </button>
            )}
          </div>
          {character && (
            <div className="text-center mt-2">
              <h3 className="text-lg font-semibold text-blue-600">
                {character.character_name}
              </h3>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {character.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scene: {currentScene} / {character.no_of_scenes}
              </p>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
          {!isGameStarted ? (
            // Start Game Interface
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={mockCharacter.avatar_url || "/male/male1/char.png"}
                    alt={mockCharacter.character_name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {mockCharacter.character_name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {mockCharacter.backstory}
                </p>
                <button
                  onClick={() => startGame()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
                >
                  🎮 Start Adventure
                </button>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Or test with a Supabase character:
                  </p>
                  <input
                    type="number"
                    placeholder="Character ID"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm mr-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const id = parseInt(
                          (e.target as HTMLInputElement).value
                        );
                        if (!isNaN(id)) {
                          startGame(id);
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      const id = parseInt(input.value);
                      if (!isNaN(id)) {
                        startGame(id);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Active Game Interface
            <>
              {/* Story History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96">
                {storyHistory.map((text, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      text.startsWith("You chose:")
                        ? "bg-blue-100 text-blue-900 ml-8 text-right"
                        : "bg-gray-100 text-gray-900 mr-8"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">
                      The storyteller is thinking...
                    </span>
                  </div>
                )}
              </div>

              {/* Action Options */}
              <div className="border-t border-gray-200 p-4">
                {error && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                    {error}
                  </div>
                )}

                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  What do you do next?
                </h4>
                <div className="space-y-2">
                  {currentOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isGenerating}
                      className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="inline w-4 h-4 mr-2 text-blue-600" />
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
