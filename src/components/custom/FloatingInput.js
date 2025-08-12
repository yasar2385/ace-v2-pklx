// components/ui/FloatingInput.js
'use client'

import React from 'react';

export function FloatingInput({
    id,
    label,
    type = 'text',
    error,
    ...props
}) {
    return (
        <div className="relative [&_input:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(var(--background))]">
            <input
                id={id}
                type={type}
                className={`
                    peer h-10 w-full border-b-2 border-input
                    text-foreground placeholder-transparent 
                    focus:outline-none focus:border-primary 
                    bg-transparent transition-colors
                    ${error ? 'border-destructive' : ''}
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    [-webkit-autofill]:bg-background
                    [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset]
                    [&:-webkit-autofill]:text-foreground
                    [&:-internal-autofill-selected]:bg-background
                    [&:-internal-autofill-selected]:text-foreground
                    appearance-none
                `}
                placeholder={label}
                autoComplete={type === 'password' ? 'current-password' : 'on'}
                {...props}
            />
            <label
                htmlFor={id}
                className={`
                    absolute left-0 -top-3.5 text-sm transition-all
                    peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-muted-foreground
                    peer-placeholder-shown:top-2
                    peer-focus:-top-3.5 
                    peer-focus:text-sm
                    peer-focus:text-foreground
                    ${error ? 'text-destructive' : 'text-muted-foreground'}
                    peer-disabled:cursor-not-allowed
                    peer-disabled:opacity-50
                    peer-[-webkit-autofill]:-top-3.5
                    peer-[-webkit-autofill]:text-sm
                    peer-[-webkit-autofill]:text-foreground
                `}
            >
                {label}
            </label>
            {error && (
                <span className="text-destructive text-xs mt-1">{error}</span>
            )}

            <style jsx global>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: hsl(var(--foreground));
                    -webkit-box-shadow: 0 0 0px 1000px hsl(var(--background)) inset;
                    transition: background-color 5000s ease-in-out 0s;
                }

                input:-internal-autofill-selected {
                    appearance: none;
                    background-image: none !important;
                    background-color: hsl(var(--background)) !important;
                    color: hsl(var(--foreground)) !important;
                }
            `}</style>
        </div>
    );
}

export default FloatingInput;