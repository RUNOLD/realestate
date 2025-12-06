import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0a192f", // Deep Navy Blue
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#1f2937", // Charcoal Grey
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#d4af37", // Brushed Gold
                    foreground: "#0a192f",
                },
                background: "#f9fafb", // Marble White / Off-white
                foreground: "#1f2937", // Dark text for contrast
                muted: {
                    DEFAULT: "#f3f4f6",
                    foreground: "#6b7280",
                },
                border: "#e5e7eb",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"], // Add a serif font for luxury feel
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
