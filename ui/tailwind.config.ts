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
  plugins: [],
};
export default config;
