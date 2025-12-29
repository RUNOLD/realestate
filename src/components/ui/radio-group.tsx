"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
// import { Circle } from "lucide-react"

// Context to pass 'name' down to items so they form a group for FormData
const RadioGroupContext = React.createContext<{ name?: string }>({})

const RadioGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { name?: string }
>(({ className, name, ...props }, ref) => {
    return (
        <RadioGroupContext.Provider value={{ name }}>
            <div className={cn("grid gap-2", className)} {...props} ref={ref} />
        </RadioGroupContext.Provider>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
    const { name } = React.useContext(RadioGroupContext)

    return (
        <div className="relative flex items-center justify-center">
            <input
                type="radio"
                name={name}
                ref={ref}
                className={cn(
                    "peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-primary text-primary shadow focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary",
                    className
                )}
                {...props}
            />

            {/* Custom absolute center dot for checked state styling override if needed, 
          but native 'checked:bg-primary' usually fills it. 
          To simulate the "dot" inside a circle, we can use an SVG icon conditionally shown, 
          OR just use standard accent-color or simple CSS. 
          For Shadcn look (circle with dot), we need a sibling element.
      */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden text-primary-foreground peer-checked:block">
                <svg
                    width="6"
                    height="6"
                    viewBox="0 0 6 6"
                    fill="currentcolor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="3" cy="3" r="3" />
                </svg>
            </span>
        </div>
    )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
