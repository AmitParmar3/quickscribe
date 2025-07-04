"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative group p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 border border-border/50 hover:border-border transition-all duration-300 hover:scale-105 hover:shadow-lg"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      {/* Hover ring */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-amber-500/30 dark:group-hover:ring-blue-500/30 transition-all duration-300" />
    </button>
  )
} 