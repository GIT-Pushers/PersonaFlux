import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

// Default avatar options
const DEFAULT_AVATARS = [
  {
    id: "male1",
    name: "Male Character 1",
    path: "/male/male1/idle.png",
    publicUrl: "/male/male1/idle.png",
  },
  {
    id: "male2",
    name: "Male Character 2",
    path: "/male/male2/idle.png",
    publicUrl: "/male/male2/idle.png",
  },
  {
    id: "male3",
    name: "Male Character 3",
    path: "/male/male3/idle.png",
    publicUrl: "/male/male3/idle.png",
  },
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
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
}
export const StepTwoForm = ({
  form,
  prevStep,
  imagePreview,
  setImagePreview,
  onGenerate,
  isGenerating,
  isSubmitting, // New prop for submission loading state
}: {
  form: UseFormReturn<CharacterFormData>;
  prevStep: () => void;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  onGenerate: () => void;
  isGenerating: boolean;
  isSubmitting: boolean; // New prop type
}) => {
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const avatarRegister = form.register("avatar");

  // State for default avatar selection
  const [selectedDefaultAvatar, setSelectedDefaultAvatar] = useState<
    string | null
  >(null);

  // Handle default avatar selection
  const handleDefaultAvatarSelect = (avatar: (typeof DEFAULT_AVATARS)[0]) => {
    setSelectedDefaultAvatar(avatar.id);
    setImagePreview(avatar.publicUrl);
    // Clear file input if user switches to default avatar
    if (avatarFileRef.current) {
      avatarFileRef.current.value = "";
    }
    form.resetField("avatar");
    // Set the avatar_url in the form
    form.setValue("avatar_url", avatar.publicUrl);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    avatarRegister.onChange(e);
    if (e.target.files?.[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setSelectedDefaultAvatar(null);
      form.setValue("avatar_url", ""); // Clear default avatar URL
    } else {
      setImagePreview(null);
    }
  };

  // Clear all avatar selections
  const clearAvatar = () => {
    form.resetField("avatar");
    form.setValue("avatar_url", "");
    if (avatarFileRef.current) {
      avatarFileRef.current.value = "";
    }
    setImagePreview(null);
    setSelectedDefaultAvatar(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Feeling Uninspired?</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          Let AI build a creative foundation for your character.
          <Button
            type="button"
            size="sm"
            onClick={onGenerate}
            disabled={isGenerating || isSubmitting}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate with AI"
            )}
          </Button>
        </AlertDescription>
      </Alert>

      <fieldset disabled={isGenerating || isSubmitting} className="space-y-6">
        <FormItem>
          <FormLabel>Character Avatar</FormLabel>

          {/* Default Avatar Options */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Choose a default avatar:
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {DEFAULT_AVATARS.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:border-blue-300 ${
                      selectedDefaultAvatar === avatar.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleDefaultAvatarSelect(avatar)}
                  >
                    <div className="aspect-square p-2 overflow-hidden">
                      <Image
                        src={avatar.publicUrl}
                        alt={avatar.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover object-left rounded-md"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-center text-gray-600 pb-2">
                      {avatar.name}
                    </p>
                    {selectedDefaultAvatar === avatar.id && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* OR Separator */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <div className="px-3 text-sm text-gray-500">OR</div>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Custom File Upload */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Upload your own image:
              </h4>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="file:text-foreground"
                  {...avatarRegister}
                  ref={(e) => {
                    avatarRegister.ref(e);
                    avatarFileRef.current = e;
                  }}
                  onChange={handleFileUpload}
                />
              </FormControl>
            </div>
          </div>

          <FormMessage />
        </FormItem>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Avatar Preview"
              fill
              style={{ objectFit: "cover" }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 rounded-full z-10"
              onClick={clearAvatar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <FormField
          control={form.control}
          name="backstory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backstory</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the character's past..."
                  rows={6}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="story_context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is the character's current situation?"
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starting_propt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The first line of dialogue or action..."
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4">
          <FormLabel className="text-base">Starting Options</FormLabel>
          <FormField
            control={form.control}
            name="start_options.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_options.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Second choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_options.2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Option 3
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Third choice for the user..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <FormLabel className="text-base">Ending Scenes (Optional)</FormLabel>
          <FormField
            control={form.control}
            name="ending_scenes.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="A potential concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ending_scenes.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="An alternative concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ending_scenes.2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-muted-foreground">
                  Ending Scene 3
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Another alternative concluding scene..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </fieldset>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="submit" size="lg" disabled={isGenerating || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            "Create Character"
          )}
        </Button>
      </div>
    </div>
  );
};
