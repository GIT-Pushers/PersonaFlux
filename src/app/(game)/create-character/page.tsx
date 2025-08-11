"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Import the router
import { Check, User, BookOpen } from "lucide-react";

// Shadcn/UI Component Imports
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { createClient } from "@/utils/supabase/client";
import { createCharacter } from "@/service/service";
import { StepTwoForm } from "./_Components/FormTwo";
import { StepOneForm } from "./_Components/Formone";
import { toast } from "sonner";

// --- DATA & TYPES ---

const STEPS = [
  { id: 1, name: "Basic Details", icon: <User className="h-4 w-4" /> },
  { id: 2, name: "Story & Context", icon: <BookOpen className="h-4 w-4" /> },
];

interface CharacterFormData {
  character_name: string;
  traits: string[];
  age?: number | "";
  gender: string;
  voice_name: string;
  no_of_scenes: string;
  language: string;
  avatar?: FileList;
  avatar_url?: string; // Add this for default avatar selection
  backstory?: string;
  story_context?: string;
  starting_prompt?: string;
  start_options: string[];
  ending_scenes: string[];
}

// --- REUSABLE & SUB-COMPONENTS ---

const FormSidebar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex h-full flex-col p-8 lg:p-12 bg-muted/50 border-r">
    <h1 className="text-3xl font-bold tracking-tight text-foreground">
      Create Character
    </h1>
    <p className="mt-2 text-muted-foreground">
      Follow the steps to bring your new character to life.
    </p>
    <nav className="mt-12 flex flex-col gap-6">
      {STEPS.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-start gap-4">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300",
                isActive
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                isCompleted &&
                  "bg-primary border-primary text-primary-foreground"
              )}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
            </div>
            <div>
              <h2
                className={cn(
                  "font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {step.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step.id === 1
                  ? "Define core attributes and identity."
                  : "Build their world and personality."}
              </p>
            </div>
          </div>
        );
      })}
    </nav>
    <div className="mt-auto text-sm text-muted-foreground">
      Powered by AI Storyteller Pro
    </div>
  </div>
);

// StepOneForm component remains unchanged...

// --- MAIN CHARACTER FORM COMPONENT ---

const stepOneFields: (keyof CharacterFormData)[] = [
  "character_name",
  "traits",
  "gender",
  "age",
  "voice_name",
  "no_of_scenes",
  "language",
];

// Helper function to convert a file to a Base64 string
const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CharacterForm = () => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission
  const supabase = createClient();
  const router = useRouter(); // Initialize router

  const form = useForm<CharacterFormData>({
    mode: "onBlur",
    defaultValues: {
      character_name: "",
      traits: [],
      age: "",
      gender: "",
      voice_name: "",
      no_of_scenes: "",
      language: "",
      backstory: "",
      story_context: "",
      starting_prompt: "",
      start_options: ["", "", ""],
      ending_scenes: ["", "", ""],
      avatar: undefined,
      avatar_url: "", // Add default value for avatar_url
    },
  });

  const handleGenerateStory = async () => {
    const isValid = await form.trigger(stepOneFields);
    if (!isValid) {
      toast.error(
        "Please fill in all required basic details before generating with AI."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const { character_name, traits, age, gender, language } =
        form.getValues();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_name, traits, age, gender, language }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const generatedData = await response.json();

      form.setValue("backstory", generatedData.backstory, {
        shouldValidate: true,
      });
      form.setValue("story_context", generatedData.story_context, {
        shouldValidate: true,
      });
      form.setValue("starting_prompt", generatedData.starting_prompt, {
        shouldValidate: true,
      });

      const startOptions = [
        ...(generatedData.start_options || []),
        "",
        "",
        "",
      ].slice(0, 3);
      form.setValue("start_options", startOptions, { shouldValidate: true });

      const endingScenes = [
        ...(generatedData.ending_scenes || []),
        "",
        "",
        "",
      ].slice(0, 3);
      form.setValue("ending_scenes", endingScenes, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast.error(
        "Sorry, something went wrong while generating the story. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: CharacterFormData) => {
    setIsSubmitting(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Could not authenticate user. Please log in again.");
      }

      // Handle avatar - either uploaded file or default selection
      let finalAvatarUrl = null;
      const avatarFile = data.avatar?.[0];

      if (avatarFile) {
        // If user uploaded a file, convert to Base64
        const avatarBase64 = await toBase64(avatarFile);
        finalAvatarUrl = avatarBase64 as string;
      } else if (data.avatar_url) {
        // If user selected a default avatar, use that URL
        finalAvatarUrl = data.avatar_url;
      }

      console.log("📤 Submitting character data:", {
        ...data,
        finalAvatarUrl,
        hasUploadedFile: !!avatarFile,
        hasDefaultAvatar: !!data.avatar_url,
      });

      const characterToInsert = {
        character_name: data.character_name,
        traits: data.traits,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender,
        voice_name: data.voice_name,
        no_of_scenes: Number(data.no_of_scenes),
        language: data.language,
        backstory: data.backstory,
        story_context: data.story_context,
        starting_prompt: data.starting_prompt,
        start_options: data.start_options.filter(
          (opt) => opt && opt.trim() !== ""
        ),
        ending_scenes: data.ending_scenes.filter(
          (scene) => scene && scene.trim() !== ""
        ),
        avatar_url: finalAvatarUrl,
        email: session.user.email,
      };

      console.log("📤 Final character data for Supabase:", characterToInsert);

      const { error: insertError } = await createCharacter(characterToInsert);

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success("Character created and saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(
        `Failed to create character: ${
          error instanceof Error ? error.message : "An unknown error occurred."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger(stepOneFields);
    if (isValid) setStep(2);
  };

  const prevStep = () => setStep(1);

  return (
    <div className="grid md:grid-cols-12 min-h-screen w-screen bg-background mt-15">
      <div className="hidden h-full md:block md:col-span-5 lg:col-span-4">
        <FormSidebar currentStep={step} />
      </div>
      <main className="md:col-span-7 lg:col-span-8 flex flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-2xl">
          <div className="md:hidden mb-8">
            <FormSidebar currentStep={step} />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 1 ? (
                <StepOneForm form={form} nextStep={nextStep} />
              ) : (
                <StepTwoForm
                  form={form}
                  prevStep={prevStep}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  onGenerate={handleGenerateStory}
                  isGenerating={isGenerating}
                  isSubmitting={isSubmitting} // Pass down the new state
                />
              )}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default CharacterForm;
