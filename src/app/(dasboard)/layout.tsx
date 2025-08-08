import NavBar from "@/components/AppNavBar";
import AppSideBar from "@/components/AppSideBar";

import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

const WebsiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <AppSideBar />

        <main className="w-full">
          <NavBar />
          <div className="px-4"> {children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default WebsiteLayout;
