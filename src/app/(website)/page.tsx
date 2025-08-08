"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Brain,
  GitBranch,
  Timer,
  Shield,
  ArrowRight,
  Sparkles,
  Cpu,
  Code,
  Database,
  Network,
  BarChart2,
  Users,
  Globe,
  ArrowDown,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const PersonafluxLanding = () => {
  // --- DATA DEFINITIONS ---

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time NPC Combat",
      description:
        "Dynamic battle systems with adaptive AI that responds to player actions in milliseconds.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Personality Engine",
      description:
        "Advanced neural networks create unique character traits, emotions, and behavioral patterns.",
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Branching Quest Paths",
      description:
        "Infinite storylines that adapt based on NPC personalities and player choices.",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Instant Generation",
      description:
        "Generate fully-formed NPCs with complete backstories and memories in under 2 seconds.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description:
        "End-to-end encryption ensures your creative worlds remain completely confidential.",
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Multi-Player Sync",
      description:
        "Seamless synchronization of NPC states across all players in real-time for shared experiences.",
    },
  ];

  const stats = [
    {
      name: "Active Developers",
      value: "12K+",
      icon: <Code className="w-8 h-8" />,
    },
    {
      name: "NPCs Generated",
      value: "5M+",
      icon: <Users className="w-8 h-8" />,
    },
    {
      name: "Global Regions",
      value: "85+",
      icon: <Globe className="w-8 h-8" />,
    },
    { name: "API Uptime", value: "99.99%", icon: <Cpu className="w-8 h-8" /> },
  ];

  const performanceData = [
    { name: "Jan", latency: 40, traditional: 80 },
    { name: "Feb", latency: 30, traditional: 72 },
    { name: "Mar", latency: 20, traditional: 65 },
    { name: "Apr", latency: 18, traditional: 60 },
    { name: "May", latency: 12, traditional: 55 },
    { name: "Jun", latency: 8, traditional: 50 },
    { name: "Jul", latency: 5, traditional: 48 },
  ];

  const personalityData = [
    { name: "Friendly", value: 35 },
    { name: "Aggressive", value: 15 },
    { name: "Neutral", value: 25 },
    { name: "Curious", value: 25 },
  ];

  const pricingPlans = [
    {
      name: "Hobbyist",
      price: "$0",
      period: "/ month",
      description: "For personal projects and getting started with our API.",
      features: [
        "10,000 API calls/month",
        "500 NPCs generation",
        "Basic Personality Engine",
        "Community support",
      ],
      buttonText: "Start for Free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/ month",
      description: "For professional developers and small studios.",
      features: [
        "1,000,000 API calls/month",
        "Unlimited NPC generation",
        "Advanced Personality Engine",
        "Real-time combat module",
        "Email & chat support",
      ],
      buttonText: "Choose Pro",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "/ year",
      description: "For large studios requiring advanced features and support.",
      features: [
        "Unlimited API calls",
        "Dedicated infrastructure",
        "On-premise deployment option",
        "24/7 premium support",
        "Custom model training",
      ],
      buttonText: "Contact Sales",
      featured: false,
    },
  ];

  const PIE_COLORS = ["#3b82f6", "#14b8a6", "#f97316", "#8b5cf6"];

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4"
          >
            <span className="text-primary">PERSONA</span>
            <span>FLUX</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            The Next-Generation AI Platform for Living, Breathing NPCs
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Database className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-border bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.name} variants={itemVariants}>
                <Card className="text-center bg-card/50">
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-muted-foreground">{stat.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Core Platform Features
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Everything you need to create dynamic, intelligent, and
              unforgettable game worlds.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="h-full group hover:border-primary transition-colors duration-300">
                  <CardHeader>
                    <div className="text-primary mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Unmatched Performance & Quality
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              See how PersonaFlux outperforms traditional systems in speed and
              intelligence.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* Latency Chart */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="w-5 h-5 mr-2 text-primary" />
                    AI Response Latency (ms)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[24rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#f9fafb",
                        }}
                        cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        name="PersonaFlux"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="traditional"
                        name="Traditional AI"
                        stroke="#6b7280"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Personality Distribution */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Personality Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[24rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={personalityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} ${(percent ?? 9 * 100).toFixed(0)}%`
                        }
                      >
                        {personalityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                        }}
                        itemStyle={{ color: "#f9fafb" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={itemVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Flexible Pricing for Any Scale
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Choose the perfect plan for your project. Cancel or upgrade
              anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={cn(
                  "h-full",
                  plan.featured ? "transform lg:scale-105" : ""
                )}
              >
                <Card
                  className={cn(
                    "flex flex-col h-full",
                    plan.featured
                      ? "border-2 border-primary shadow-primary/20 shadow-lg"
                      : ""
                  )}
                >
                  <CardHeader className="pb-4">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full"
                      variant={plan.featured ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="bg-primary/10 rounded-lg p-10 md:p-16 text-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to Revolutionize Your Game?
              </h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Join thousands of developers creating the next generation of
                interactive experiences. Your players deserve characters they&apos;ll
                remember forever.
              </p>
              <Button size="lg" className="mt-8 text-lg px-8 py-6">
                Start Creating Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">PERSONAFLUX</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">Docs</Button>
              <Button variant="ghost">Contact</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PersonaFlux Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PersonafluxLanding;
