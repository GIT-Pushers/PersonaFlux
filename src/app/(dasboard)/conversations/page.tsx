"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  getCharactersByEmail,
  getGameLogCountByCharacterId,
  CharacterData,
} from "@/service/service";

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  MessageSquare,
  History,
} from "lucide-react";

const ConversationHistoryPage: React.FC = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [conversationCounts, setConversationCounts] = useState<{
    [key: number]: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user?.email) throw new Error("User not logged in.");

        // Fetch characters
        const { data: charactersData, error: charactersError } =
          await getCharactersByEmail(user.email);
        if (charactersError) throw charactersError;

        if (charactersData) {
          setCharacters(charactersData);

          // Fetch conversation counts for each character
          const counts: { [key: number]: number } = {};
          await Promise.all(
            charactersData.map(async (character) => {
              const { data: count } = await getGameLogCountByCharacterId(
                character.id
              );
              counts[character.id] = count || 0;
            })
          );
          setConversationCounts(counts);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-muted"></div>
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 w-full bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8">
        <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
          <header className="flex items-center gap-4 mb-8">
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
          </header>
          <div className="flex-1">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8">
        <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
          <header className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive font-semibold mb-4">
                Error: {error}
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden">
      <div className="h-full w-full flex flex-col p-4 sm:p-6 md:p-8">
        <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <History className="h-8 w-8 text-purple-600" />
                  Conversation History
                </h1>
                <p className="text-muted-foreground mt-1">
                  View detailed game logs for each of your characters
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </header>

          <main className="flex-1 overflow-auto">
            {characters.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-16 border-2 border-dashed rounded-lg max-w-md mx-auto">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold">No Characters Found</h2>
                  <p className="text-muted-foreground mt-2">
                    Create characters first to see their conversation history.
                  </p>
                  <Button
                    onClick={() => router.push("/create-character")}
                    className="mt-6"
                  >
                    Create Your First Character
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {characters.map((character) => {
                  const conversationCount =
                    conversationCounts[character.id] || 0;
                  return (
                    <Card
                      key={character.id}
                      className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                    >
                      <CardContent className="p-0">
                        <div className="relative w-full h-48">
                          <Image
                            src={
                              character.avatar_url ||
                              `https://placehold.co/400x400/27272a/e5e5e5?text=${character.character_name.charAt(
                                0
                              )}`
                            }
                            alt={character.character_name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="bg-muted group-hover:scale-110 transition-transform duration-300"
                          />
                          {conversationCount > 0 && (
                            <div className="absolute top-3 right-3">
                              <Badge
                                variant="secondary"
                                className="bg-black/70 text-white border-none"
                              >
                                {conversationCount} conversation
                                {conversationCount !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardHeader className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {character.character_name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-lg group-hover:text-purple-600 transition-colors">
                              {character.character_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(character.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {character.traits.slice(0, 2).map((trait) => (
                              <Badge
                                key={trait}
                                variant="outline"
                                className="text-xs"
                              >
                                {trait}
                              </Badge>
                            ))}
                            {character.traits.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{character.traits.length - 2}
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {character.backstory}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 pb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/home/${character.id}`);
                            }}
                            className="w-full"
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/game-logs/${character.id}`);
                            }}
                            className="w-full"
                            disabled={conversationCount === 0}
                          >
                            <Clock className="mr-1 h-4 w-4" />
                            {conversationCount > 0 ? "View Logs" : "No Logs"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistoryPage;
