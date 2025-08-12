import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FloatingDropdownRadio = ({
  label,
  name,
  options = [],
  value = '',
  onChange,
  error,
  required = false,
  placeholder = "Select option..."
}) => {
  const safeOptions = Array.isArray(options) ? options : [];
  const selectedOption = safeOptions.find(option => option.value === value);

  return (
    <div className="relative space-y-2">
      <Label
        className={cn(
          "text-sm",
          error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-label={label}
            className={cn(
              "w-full min-h-[40px]", // Fixed height
              "relative flex items-center justify-between", // Stable flex layout
              "select-none", // Prevent text selection
              "border border-input",
              "transition-colors duration-200", // Smooth transitions
              "hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          className={cn(
            "w-[var(--radix-dropdown-menu-trigger-width)]", // Match trigger width
            "min-w-[8rem]",
            "p-1", // Consistent padding
            "animate-in fade-in-0 zoom-in-95", // Smooth animation
            "border border-input bg-popover shadow-md"
          )}
          align="start"
          sideOffset={4}
        >
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(newValue) => {
              onChange({ target: { name, value: newValue } });
            }}
          >
            {safeOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex w-full cursor-default",
                  "select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm",
                  "outline-none transition-colors",
                  "focus:bg-accent focus:text-accent-foreground",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                )}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <span className="text-xs text-destructive font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingDropdownRadio;