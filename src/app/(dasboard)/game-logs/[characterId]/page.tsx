"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  getCharacterById,
  getGameLogsByCharacterId,
  GameLog,
  CharacterData,
} from "@/service/service";

// Import Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const GameLogsPage = () => {
  const params = useParams();
  const router = useRouter();
  const characterId = parseInt(params.characterId as string);

  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

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

        // Fetch character details
        const { data: characterData, error: characterError } =
          await getCharacterById(characterId);
        if (characterError) throw characterError;
        if (!characterData) throw new Error("Character not found.");

        setCharacter(characterData);

        // Fetch game logs for this character
        const { data: gameLogsData, error: gameLogsError } =
          await getGameLogsByCharacterId(characterId);
        if (gameLogsError) throw gameLogsError;

        setGameLogs(gameLogsData || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (characterId) {
      fetchData();
    }
  }, [characterId]);

  const toggleLogExpansion = (logId: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-5/6 bg-muted rounded"></div>
              <div className="h-4 w-4/6 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
          </header>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </header>
          <div className="text-center py-16">
            <p className="text-destructive font-semibold">Error: {error}</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Game History: {character?.character_name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {gameLogs.length} conversation{gameLogs.length !== 1 ? "s" : ""}{" "}
                recorded
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => router.push(`/home/${characterId}`)}
            className="w-full sm:w-auto"
          >
            <Play className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </header>

        {/* Character Info Card */}
        {character && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      character.avatar_url ||
                      `https://placehold.co/200x200/27272a/e5e5e5?text=${character.character_name.charAt(
                        0
                      )}`
                    }
                    alt={character.character_name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="bg-muted"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {character.character_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {character.backstory}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {character.traits.slice(0, 3).map((trait) => (
                      <Badge
                        key={trait}
                        variant="secondary"
                        className="text-xs"
                      >
                        {trait}
                      </Badge>
                    ))}
                    {character.traits.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{character.traits.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <main>
          {gameLogs.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold">No Game History</h2>
              <p className="text-muted-foreground mt-2">
                Start playing with {character?.character_name} to see
                conversation history here.
              </p>
              <Button
                onClick={() => router.push(`/home/${characterId}`)}
                className="mt-6"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Playing
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {gameLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleLogExpansion(log.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-lg">
                                Game Session #{log.id}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {formatDate(log.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {log.game_summary.length} turn
                              {log.game_summary.length !== 1 ? "s" : ""}
                            </Badge>
                            {expandedLogs.has(log.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {log.game_summary.map((turn, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-muted pl-4 pb-4"
                            >
                              <div className="text-sm font-medium text-muted-foreground mb-2">
                                Turn {index + 1}
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium">Prompt:</p>
                                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                    {turn.prompt}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Description:
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {turn.description}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Available Options:
                                  </p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-2">
                                    {turn.options.map((option, optIndex) => (
                                      <li
                                        key={optIndex}
                                        className={
                                          option === turn.selected_option
                                            ? "font-medium text-foreground bg-primary/10 px-2 py-1 rounded"
                                            : ""
                                        }
                                      >
                                        {option}
                                        {option === turn.selected_option &&
                                          " ✓"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GameLogsPage;
