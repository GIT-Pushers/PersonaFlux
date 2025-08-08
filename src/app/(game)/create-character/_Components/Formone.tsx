import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ComboBox"; // Assuming this is the correct path
import { MultiSelect } from "@/components/ui/multiSelect"; // Use from components folder
import { TRAIT_OPTIONS } from "@/lib/traitsOptions";
import { LANGUAGE_OPTIONS } from "@/lib/Language";

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Other", "Unspecified"];
const VOICE_OPTIONS = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];
const SCENE_OPTIONS = ["5", "10", "15", "20", "25"];

interface CharacterFormData {
  character_name: string;
  traits: string[];
  age?: number | "";
  gender: string;
  voice_name: string;
  no_of_scenes: string;
  language: string;
  avatar?: FileList;
  backstory?: string;
  story_context?: string;
  starting_propt?: string;
  start_options: string[];
  ending_scenes: string[];
}

export const StepOneForm = ({
  form,
  nextStep,
}: {
  form: UseFormReturn<CharacterFormData>;
  nextStep: () => void;
}) => (
  <div className="space-y-6 animate-in fade-in-50 duration-500">
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="character_name"
        rules={{ required: "Character name is required." }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Character Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Captain Eva Rostova" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="traits"
        rules={{
          validate: (v) => v.length > 0 || "Please select at least one trait.",
        }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Traits</FormLabel>
            <FormControl>
              <MultiSelect options={TRAIT_OPTIONS} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        rules={{ required: "Gender is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {GENDER_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="age"
        rules={{ min: { value: 1, message: "Age must be positive." } }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="35"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voice_name"
        rules={{ required: "A voice is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Name</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VOICE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="no_of_scenes"
        rules={{ required: "Number of scenes is required." }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Scenes</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a number" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SCENE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="language"
        rules={{ required: "Language is required." }}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Language</FormLabel>
            <FormControl>
              <Combobox
                options={LANGUAGE_OPTIONS}
                placeholder="Select a language"
                searchPlaceholder="Search languages..."
                emptyPlaceholder="No language found."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />{" "}
      {/* Fixed: Added the closing tag here */}
    </div>
    <div className="flex justify-end pt-4">
      <Button type="button" size="lg" onClick={nextStep}>
        Next: Story & Context
      </Button>
    </div>
  </div>
);
