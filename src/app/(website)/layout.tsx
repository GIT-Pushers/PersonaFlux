import Navbar from "@/components/NavBar";
import React, { ReactNode } from "react";

const WebsiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar navItems={navItems} />

      {children}
    </div>
  );
};
const navItems = [
  { name: "DashBoard", link: "/dashboard" },
  { name: "Contact", link: "/contact" },
  { name: "About", link: "/about" },
];
export default WebsiteLayout;
