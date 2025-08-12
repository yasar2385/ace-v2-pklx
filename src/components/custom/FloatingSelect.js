import React from 'react';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const FloatingSelect = ({
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
            <div className="relative space-y-2 min-h-[80px]">
            <Select
                value={value}
                onValueChange={(newValue) => {
                    onChange({ target: { name, value: newValue } });
                }}
            >
                <SelectTrigger
                    className={cn(
                        "w-full",
                        error && "border-destructive focus-visible:ring-destructive"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="fixed">
                    {safeOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
            {error && (
                <span className="text-xs text-destructive font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};

export default FloatingSelect;