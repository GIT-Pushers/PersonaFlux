"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  Plus,
  User,
  ChevronLeft,
  History,
  Gamepad2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCharactersByEmail,
  getGameLogsByCharacterId,
  CharacterData,
} from "@/service/service";
import { createClient } from "@/utils/supabase/client";

interface ConversationCount {
  characterId: number;
  count: number;
}

export function GameSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [conversationCounts, setConversationCounts] = useState<
    ConversationCount[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchCharactersAndCounts = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const { data: charactersData } = await getCharactersByEmail(user.email);

      if (charactersData) {
        setCharacters(charactersData);

        // Fetch conversation counts for each character
        const counts = await Promise.all(
          charactersData.map(async (character) => {
            const { data: logs } = await getGameLogsByCharacterId(character.id);
            return {
              characterId: character.id,
              count: logs?.length || 0,
            };
          })
        );

        setConversationCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching characters and counts:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUser({ email: user.email });
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchCharactersAndCounts();
    }
  }, [user?.email, fetchCharactersAndCounts]);

  const getConversationCount = (characterId: number) => {
    return (
      conversationCounts.find((c) => c.characterId === characterId)?.count || 0
    );
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Create Character",
      icon: Plus,
      href: "/create-character",
    },
    {
      title: "Conversation History",
      icon: History,
      href: "/conversations",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <Sidebar className="border-r bg-gradient-to-b from-purple-50 to-blue-50">
      <SidebarHeader className="border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4 py-3">
          <Gamepad2 className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-lg text-gray-900">PersonaFlux</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Characters with Game History */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Your Characters
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              ) : characters.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No characters yet
                </div>
              ) : (
                characters.map((character) => {
                  const conversationCount = getConversationCount(character.id);
                  return (
                    <SidebarMenuItem key={character.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/home/${character.id}`}
                          className="flex items-center justify-between w-full group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {character.character_name.charAt(0)}
                            </div>
                            <span className="truncate text-sm">
                              {character.character_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {conversationCount > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs h-5 min-w-[20px] flex items-center justify-center"
                              >
                                {conversationCount}
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/conversations?character=${character.id}`;
                              }}
                            >
                              <History className="h-3 w-3" />
                            </Button>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-white/50 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Main</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
