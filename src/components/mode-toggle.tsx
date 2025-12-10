"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-2"
            >
                <Sun size={16} /> Light
            </Button>
            <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-2"
            >
                <Moon size={16} /> Dark
            </Button>
            <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme("system")}
            >
                System
            </Button>
        </div>
    )
}
