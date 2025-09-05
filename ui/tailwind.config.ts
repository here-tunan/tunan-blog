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
  plugins: [
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
