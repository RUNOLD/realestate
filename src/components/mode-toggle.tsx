"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const THEMES = [
  { name: "light", icon: Sun, label: "Light Mode" },
  { name: "dark", icon: Moon, label: "Dark Mode" },
  { name: "system", icon: Monitor, label: "System Theme" },
]

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <div className="flex items-center gap-1.5">
      {THEMES.map(({ name, icon: Icon, label }) => {
        const isActive = mounted && theme === name
        
        return (
          <Button
            key={name}
            variant={isActive ? "default" : "ghost"} // Using "ghost" for non-active looks cleaner
            size="icon" // Set size to "icon" for perfect square proportions
            onClick={() => setTheme(name)}
            disabled={!mounted}
            title={label} // Tooltip for accessibility
            aria-label={label}
            className={cn(
              "h-9 w-9 transition-all duration-300", 
              !mounted && "opacity-50 cursor-wait"
            )}
          >
            <Icon size={18} className={cn(isActive ? "scale-110" : "scale-100")} />
          </Button>
        )
      })}
    </div>
  )
}