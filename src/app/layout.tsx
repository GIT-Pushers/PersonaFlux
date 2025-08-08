import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Title object for dynamic page titles.
  title: {
    default: "PersonaFlux | AI NPC Dialogue & Backstory Generator", // Default title for the site.
    template: `%s | PersonaFlux`, // Template for titles on other pages.
  },

  // The website's primary description for search engine results.
  description:
    "Bring your virtual worlds to life. PersonaFlux generates dynamic, personality-driven dialogue and rich backstories for your game NPCs in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      
        {children}
        <Toaster />
      </body>
    </html>
  );
}

