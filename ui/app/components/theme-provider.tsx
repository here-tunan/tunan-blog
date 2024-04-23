"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import {themes} from "@/app/themes";

const themeNames = themes.map(o => o.theme)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider themes={themeNames} {...props}>{children}</NextThemesProvider>
}
