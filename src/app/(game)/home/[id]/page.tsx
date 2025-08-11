"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Loader2, Move } from "lucide-react";
import { motion } from "framer-motion";

import { useChar } from "@/store/useChar";
import NPCBubble from "@/components/NpcBubble";
import { getCharacterById } from "@/service/service";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Character {
  id: number;
  character_name: string;
  avatar_url: string | null;
  traits: string[];
  backstory: string;
  story_context: string;
  starting_prompt?: string;
  start_options: string[];
  no_of_scenes: number;
  language?: string;
  age?: number;
  gender?: string;
  voice_name?: string;
  ending_scenes?: string[];
}

const Home = () => {
  const [currentImage, setCurrentImage] = useState(2);
  const { id: characterId } = useParams();
  const { isDraggable, setIsDraggable } = useChar();

  const [character, setCharacter] = useState<Character | null>(null);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (character?.no_of_scenes && currentScene > character.no_of_scenes) {
      const handleGameComplete = () => {
        if (
          confirm(
            "Adventure Complete! You've reached the end of this story. Would you like to return to the dashboard to start a new adventure?"
          )
        ) {
          router.push("/dashboard");
        }
      };
      handleGameComplete();
      return;
    }
  }, [currentScene, character?.no_of_scenes, router]);
  const mockCharacter: Character = useMemo(
    () => ({
      id: 1,
      character_name: "Aria the Brave",
      avatar_url: "/male/male1/char.png",
      traits: ["brave", "witty", "charismatic"],
      backstory:
        "A fearless warrior who has traveled across many realms seeking adventure and justice.",
      story_context:
        "Standing at the entrance of an ancient dungeon, rumors of treasure and danger echo in the air.",
      starting_prompt:
        "The ancient stone door creaks open, revealing darkness beyond. A cold wind carries whispers of forgotten secrets.",
      start_options: [
        "Light a torch and step boldly into the darkness",
        "Listen carefully to the whispers before proceeding",
        "Search the entrance for any clues or traps",
      ],
      no_of_scenes: 10,
      language: "English",
      age: 28,
      gender: "Female",
      voice_name: "Alloy",
      ending_scenes: [
        "You emerge victorious with ancient treasures",
        "You sacrifice yourself to save others",
        "You disappear into the mystical realm forever",
      ],
    }),
    []
  );

  const fetchCharacterFromSupabase = async (characterId: number) => {
    setIsGenerating(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getCharacterById(characterId);
      if (fetchError) throw fetchError;
      if (!data) throw new Error("Character not found");
      return {
        id: data.id,
        character_name: data.character_name,
        avatar_url: data.avatar_url || null,
        traits: data.traits || [],
        backstory: data.backstory || "No backstory available.",
        story_context: data.story_context || "The adventure begins...",
        starting_prompt: data.starting_prompt || "Your story starts here...",
        start_options: data.start_options || [
          "Continue",
          "Look around",
          "Wait",
        ],
        no_of_scenes: data.no_of_scenes || 5,
        language: data.language || "English",
        age: data.age,
        gender: data.gender,
        voice_name: data.voice_name,
        ending_scenes: data.ending_scenes || [],
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load character: ${errorMessage}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const startGame = useCallback(
    async (characterId?: number) => {
      const gameCharacter = characterId
        ? await fetchCharacterFromSupabase(characterId)
        : mockCharacter;
      if (!gameCharacter) return;
      setCharacter(gameCharacter);
      setStoryHistory([
        gameCharacter.starting_prompt || "The adventure begins...",
      ]);
      setCurrentOptions(gameCharacter.start_options || []);
      setCurrentScene(1);
      setError(null);
    },
    [mockCharacter]
  );

  const handleOptionSelect = async (selectedOption: string) => {
    if (!character || isGenerating) return;
    if (selectedOption === "End Adventure") return resetGame();
    if (selectedOption === "Start New Adventure") return startGame();

    setIsGenerating(true);
    setError(null);

    try {
      // Send entire character data to AI for better context
      const requestData = {
        character_name: character.character_name,
        age: character.age || 25,
        gender: character.gender || "Unknown",
        traits: character.traits,
        backstory: character.backstory,
        story_context: character.story_context,
        ending_scenes: character.ending_scenes || [],
        voice_name: character.voice_name || "Alloy",
        language: character.language || "English",
        starting_prompt: `The user chose: \"${selectedOption}\". Continue the story and provide 3 new choices. Story so far: ${storyHistory
          .slice(-2)
          .join(" ")}`,
        current_scene: currentScene,
        total_scenes: character.no_of_scenes || 5,
      };

      const response = await fetch("/api/generate-npc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (result.success) {
        // Generate a description of the event that happens after the player's choice
        const eventDescription = `You chose: ${selectedOption}`;
        const newStory = result.npc_dialogue.join(" ");

        setStoryHistory((prev) => [...prev, eventDescription, newStory]);
        setCurrentOptions(result.player_options || []);
        setCurrentScene((scene) => scene + 1);

        // Check if game should end based on scenes or story progression
        const isNearEnd = currentScene >= (character.no_of_scenes || 5) - 1;
        const hasEndingKeywords =
          newStory.toLowerCase().includes("end") ||
          newStory.toLowerCase().includes("conclude") ||
          newStory.toLowerCase().includes("final");

        if (isNearEnd || hasEndingKeywords) {
          console.log("🎮 Game approaching ending...");
          console.log("📊 Game Stats:", {
            character: character.character_name,
            scenes_played: currentScene,
            total_scenes: character.no_of_scenes,
            choices_made:
              storyHistory.filter((item) => item.startsWith("You chose:"))
                .length + 1,
            story_length: storyHistory.join(" ").length,
          });

          // Check if this is the final scene
          if (currentScene >= (character.no_of_scenes || 5)) {
            console.log("🏁 GAME ENDED!");
            console.log("📖 Complete Story:", storyHistory.join("\n"));
            console.log("🎭 Character:", character);
            setCurrentOptions([
              "End Adventure",
              "Start New Adventure",
              "Continue Exploring",
            ]);
          }
        }
      } else {
        setError(result.error || "Failed to generate story continuation");
      }
    } catch {
      setError("Failed to generate next scene. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGame = () => {
    setCharacter(null);
    setStoryHistory([]);
    setCurrentOptions([]);
    setCurrentScene(1);
    setError(null);
  };

  const handlePrev = () =>
    setCurrentImage((prev) => (prev === 0 ? 6 : prev - 1));
  const handleNext = () =>
    setCurrentImage((prev) => (prev >= 6 ? 1 : prev + 1));

  useEffect(() => {
    if (characterId) {
      startGame(parseInt(characterId as string));
    }
  }, [characterId, startGame]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [storyHistory, isGenerating]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <section className="hero bg-amber-700 w-full md:w-3/5 flex items-center justify-center relative overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-4 z-10 p-2 rounded-full hover:bg-opacity-80 bg-opacity-60 bg-black text-white"
        >
          <ArrowLeft />
        </button>
        <Image
          src={`/Summer${currentImage}.png`}
          alt={`Summer ${currentImage}`}
          fill
          className="absolute object-cover"
        />
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 p-2 rounded-full hover:bg-opacity-80 bg-opacity-60 bg-black text-white"
        >
          <ArrowRight />
        </button>
        <motion.div
          drag={isDraggable}
          dragConstraints={{ top: -100, bottom: 100, left: -150, right: 150 }}
          dragElastic={0.1}
          className="absolute left-1/2 transform -translate-x-1/2 text-white text-center"
        >
          <NPCBubble
            message={
              storyHistory
                .slice()
                .reverse()
                .find((t) => !t.startsWith("You chose:")) ??
              "Hello! How can I assist you today?"
            }
          />
          <div
            className={`scale-[2.5] w-[128px] h-[128px] bg-no-repeat ${
              isDraggable ? "cursor-grab" : "cursor-default"
            }`}
            style={{
              animation: "idle 1s steps(6) infinite",
              backgroundSize: "auto",
              backgroundImage: character?.avatar_url
                ? `url('${character.avatar_url}')`
                : `url('/male/male1/idle.png')`,
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

      <section className="bg-gray-50 w-full md:w-2/5 flex flex-col p-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Interactive Story
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDraggable(!isDraggable)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
                  isDraggable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {" "}
                <Move className="w-4 h-4" />
                {isDraggable ? "Draggable On" : "Draggable Off"}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </button>
            </div>
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

        <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth">
            {storyHistory.map((text, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-xl shadow ${
                  text.startsWith("You chose:")
                    ? "bg-blue-100 text-blue-900 ml-auto text-right"
                    : "bg-gray-200 text-gray-900 mr-auto"
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
            <div ref={chatEndRef} />
          </div>

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
        </div>
      </section>
    </div>
  );
};

export default Home;
