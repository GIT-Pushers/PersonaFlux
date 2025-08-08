"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

const Navbar = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    submenu?: { name: string; link: string }[];
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Get user session and set up a listener for auth changes
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Simplified scroll event listener to only track if the page is scrolled
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      setIsScrolled(current > 0.02);
    }
  });

  // Effect to handle body scroll and escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Animation variants for mobile menu
  const mobileMenuVariants: Variants = {
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const menuItemVariants: Variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 inset-x-0 max-w-6xl mx-auto z-50 px-4",
          className
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-2 lg:px-4",
            "rounded-2xl border backdrop-blur-lg transition-all duration-300",
            "bg-background/80",
            isScrolled
              ? "shadow-md border-border"
              : "shadow-sm border-transparent"
          )}
        >
          <Link href="/" className="pl-2 font-bold text-xl text-primary">
            PersonaFlux
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((navItem, idx) => (
              <div
                key={`nav-${idx}`}
                className="relative"
                onMouseEnter={() =>
                  setActiveSubmenu(navItem.submenu ? idx : null)
                }
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={navItem.link}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg",
                    "text-sm font-medium transition-colors duration-200",
                    pathname === navItem.link
                      ? "text-primary-foreground bg-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span>{navItem.name}</span>
                  {navItem.submenu && (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  )}
                </Link>

                <AnimatePresence>
                  {navItem.submenu && activeSubmenu === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl border shadow-lg overflow-hidden"
                    >
                      {navItem.submenu.map((subItem, subIdx) => (
                        <Link
                          key={`sub-${subIdx}`}
                          href={subItem.link}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <Link href="/profile">
                <Button>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="rounded-lg">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-lg"
          >
            <div className="h-full flex flex-col justify-center items-center space-y-4">
              {navItems.map((navItem) => (
                <motion.div
                  key={`mobile-${navItem.link}`}
                  variants={menuItemVariants}
                >
                  <Link
                    href={navItem.link}
                    className="block text-2xl font-semibold text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={menuItemVariants}
                className="pt-8 flex flex-col items-center space-y-4"
              >
                {user ? (
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button size="lg" className="w-48 rounded-lg">
                      <UserIcon className="mr-2 h-5 w-5" />
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="lg">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button size="lg" className="w-48 rounded-lg">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
