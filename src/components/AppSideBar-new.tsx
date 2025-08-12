"use client";
import { Home, Settings, Plus, History, Gamepad2 } from "lucide-react";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";

const AppSideBar = () => {
  const gameItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Create Character",
      url: "/create-character",
      icon: Plus,
    },
    {
      title: "Conversation History",
      url: "/conversations",
      icon: History,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: Settings,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="bg-gradient-to-b from-purple-50 to-blue-50 h-full"
    >
      <SidebarHeader className="mt-2 border-b bg-white/50 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-purple-600" />
                <span className="font-bold text-lg text-gray-900">
                  PersonaFlux
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="w-[90%] mx-auto" />
      <SidebarContent className="flex-1">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
