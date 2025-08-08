"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useChar } from "@/store/useChar";

const TRAITS = ["Brave", "Curious", "Loyal", "Smart", "Kind", "Funny", "Wise"];

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  {
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
  }
>(({ options, value, onChange }, ref) => {
  const [open, setOpen] = useState(false);
  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">Select traits...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search traits..." />
          <CommandList>
            <CommandEmpty>No trait found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValues = value.includes(option.value)
                      ? value.filter((v) => v !== option.value)
                      : [...value, option.value];
                    onChange(newValues);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
MultiSelect.displayName = "MultiSelect";

export function TraitsMultiSelect() {
  const { traits, setTraits } = useChar();
  const [selectedTraits, setSelectedTraits] = useState<string[]>(traits || []);
  const [open, setOpen] = useState(false);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
    setTraits?.(selectedTraits);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="traits" className="text-sm font-medium text-gray-200">
        Traits
      </label>

      {/* Display selected traits as chips */}
      <div className="flex flex-wrap gap-2">
        {selectedTraits.map((trait) => (
          <div
            key={trait}
            className="flex items-center bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
          >
            {trait}
            <button
              type="button"
              onClick={() => toggleTrait(trait)}
              className="ml-1 text-white hover:text-gray-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden input to store comma-separated traits */}
      <input type="hidden" name="traits" value={selectedTraits.join(",")} />

      {/* Trigger for the popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            {selectedTraits.length === 0 ? "Select traits" : "Edit traits"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search traits..." />
            <CommandList>
              {TRAITS.map((trait) => (
                <CommandItem
                  key={trait}
                  onSelect={() => toggleTrait(trait)}
                  className={
                    selectedTraits.includes(trait)
                      ? "bg-blue-100 text-blue-700"
                      : ""
                  }
                >
                  {trait}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
