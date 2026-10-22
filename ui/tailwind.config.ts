import type { Config } from "tailwindcss";


const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 纸墨编辑部语义色 (token 见 globals.css, 契约见 DESIGN.md) */
        background: 'oklch(var(--paper) / <alpha-value>)',
        foreground: 'oklch(var(--ink) / <alpha-value>)',
        border: 'oklch(var(--line) / <alpha-value>)',
        ring: 'oklch(var(--tone-indigo) / <alpha-value>)',
        card: 'oklch(var(--paper-raised) / <alpha-value>)',
        popover: 'oklch(var(--paper-raised) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--tone-indigo) / <alpha-value>)',
          foreground: 'oklch(0.99 0.004 95 / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--paper-raised) / <alpha-value>)',
          foreground: 'oklch(var(--ink-3) / <alpha-value>)',
        },
        'muted-foreground': 'oklch(var(--ink-3) / <alpha-value>)',
        accent: {
          DEFAULT: 'oklch(var(--tone-indigo-wash) / <alpha-value>)',
          foreground: 'oklch(var(--tone-indigo-deep) / <alpha-value>)',
        },
        'accent-foreground': 'oklch(var(--tone-indigo-deep) / <alpha-value>)',
      },
      backgroundColor: {
        skin: {
          base: 'var(--color-background-base)',
        },
        button: {
          base: 'var(--color-button-bg-base)',
        }
      },
      borderColor: {
        button: {
          base: 'var(--color-button-border-base)'
        }
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',
        },
        '.custom-scroll': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.custom-scroll::-webkit-scrollbar': {
          'display': 'none',
        },
      });
    },
  ],
};
export default config;
