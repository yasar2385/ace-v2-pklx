// FloatingCombobox.jsx
import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FloatingCombobox = ({
  label,
  name,
  options = [],  // Default to an empty array if options is not provided
  value = '',
  onChange,
  error,
  required = false,
  open,
  setOpen,
  placeholder = "Select option...",
  emptyText = "No results found."
}) => {


  const safeOptions = Array.isArray(options) ? options : []; // Ensure options is always an array

  const handleSelect = (currentValue) => {
    if (!onChange) return;

    const newValue = currentValue === value ? "" : currentValue;
    onChange({ target: { name, value: newValue } });
    setOpen(false);
  };
  // const parentOptions = fetchData() || []; // Ensure options are always an array

  const selectedOption = safeOptions.find(option => option.value === value);
  const getCommands = function () {
    if (!Array.isArray(safeOptions) || safeOptions.length === 0) {
      console.warn("safeOptions is empty or invalid.");
      return [];
    }

    return safeOptions.map((option) => (
      <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
        <Check
          className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")}
        />
        {option.label}
      </CommandItem>
    ));
  };
  const finalList = getCommands();
  console.log(finalList);
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-background",
              "border border-input hover:bg-accent hover:text-accent-foreground",
              "h-10 px-3 py-2",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0"
          align="start"
        >
          <Command className="w-full border rounded-lg">
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {

                <CommandItem key={safeOptions[0].value} value={safeOptions[0].value} onSelect={handleSelect}>
                  <Check className={cn("mr-2 h-4 w-4", value === safeOptions[0].value ? "opacity-100" : "opacity-0")}/>
                  {safeOptions[0].label}
                </CommandItem>
              }
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <span className="text-xs text-destructive font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingCombobox;
