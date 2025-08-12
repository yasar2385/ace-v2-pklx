// components/ui/FloatingRadioSelect.js
'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function FloatingRadioSelect({
  label,
  name,
  options,
  value,
  onChange,
  error = '',
  required = false,
}) {
  const handleRadioChange = (newValue) => {
    // Create synthetic event to match standard onChange API
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className="relative space-y-2">
      <Label
        className={`text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <RadioGroup
        name={name}
        value={value}
        onValueChange={handleRadioChange}
        className="flex flex-col space-y-1.5"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center space-x-2 ${error ? 'border-red-500' : ''
              }`}
          >
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className={`border-input text-primary ${error ? 'ring-2 ring-red-500' : ''
                }`}
              role="radio"
              aria-checked={value === option.value}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  );
}

export default FloatingRadioSelect;
