"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Brain, Heart, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

// --- TEAM & VALUES DATA ---
const teamMembers = [
  {
    name: "Alex Thorne",
    role: "Founder & CEO",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    bio: "A visionary game developer with a passion for creating immersive narrative experiences through cutting-edge AI.",
  },
  {
    name: "Dr. Lena Petrova",
    role: "Head of AI Research",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    bio: "A leading expert in natural language processing and generative models, driving the core of our personality engine.",
  },
  {
    name: "Ben Carter",
    role: "Lead Platform Engineer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    bio: "The architect behind our scalable, real-time infrastructure, ensuring seamless performance for millions of users.",
  },
];

const coreValues = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Innovation",
    description:
      "We are driven by a relentless curiosity to push the boundaries of what's possible in AI and interactive storytelling.",
  },
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "Creativity",
    description:
      "We build tools that empower creators, freeing them to focus on crafting unforgettable characters and worlds.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Player Experience",
    description:
      "Our ultimate goal is to enable deeper, more meaningful interactions that resonate with players long after they log off.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Ethical AI",
    description:
      "We are committed to the responsible development of AI, ensuring fairness, transparency, and respect in every interaction.",
  },
];

const AboutPage = () => {
  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 sm:pt-32">
      <motion.div
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
            We&apos;re Powering the Next Generation of Storytelling.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            At PersonaFlux, we believe that the most memorable games are built
            on the foundation of unforgettable characters. Our mission is to
            provide developers with the tools to create truly dynamic and
            lifelike NPCs that captivate players and enrich virtual worlds.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center mb-16 md:mb-24"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded by a team of veteran game developers and AI researchers,
              PersonaFlux was born from a shared frustration: NPCs often felt
              like static, predictable set pieces rather than living parts of a
              world. We saw an opportunity to leverage the power of generative
              AI to break this mold.
              <br />
              <br />
              After years of research and development, we created a
              sophisticated personality engine capable of generating nuanced
              dialogue, rich backstories, and adaptive behaviors in real-time.
              Today, we&apos;re proud to partner with studios of all sizes to help
              them build the next generation of interactive entertainment.
            </p>
          </motion.div>
          <motion.div
            className="h-80 rounded-xl bg-muted flex items-center justify-center"
            variants={itemVariants}
          >
            <Brain className="w-24 h-24 text-primary/20" />
          </motion.div>
        </motion.div>

        {/* Meet the Team Section */}
        <motion.div className="mb-16 md:mb-24" variants={containerVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Meet the Innovators
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The minds behind the magic.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <p className="mt-2 text-muted-foreground text-sm">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Values Section */}
        <motion.div className="mb-16 md:mb-24" variants={containerVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide our work.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    {value.icon}
                    <CardTitle className="mt-4">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-primary/10 border-primary/20">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Join Us in Shaping the Future
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Ready to create characters that players will remember forever?
                Explore our platform and start building your next great story
                today.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="mt-6">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
