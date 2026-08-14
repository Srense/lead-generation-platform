/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                // Premium Dark Fintech Palette
                "background": "#09090B", // Zinc-950 (Almost black)
                "on-background": "#F8FAFC",
                
                "surface": "#18181B", // Zinc-900
                "on-surface": "#F8FAFC",
                "surface-variant": "#27272A", // Zinc-800
                "on-surface-variant": "#A1A1AA", // Zinc-400
                
                // Primary: Neon Lime / Emerald (Classic crypto/fintech accent)
                "primary": "#10B981", 
                "on-primary": "#000000",
                "primary-container": "#047857",
                "on-primary-container": "#D1FAE5",

                // Secondary: Electric Blue (Trust, tech)
                "secondary": "#3B82F6",
                "on-secondary": "#FFFFFF",
                "secondary-container": "#1D4ED8",
                "on-secondary-container": "#DBEAFE",

                // Tertiary: Deep Amethyst / Purple (Modern crypto gradient)
                "tertiary": "#8B5CF6",
                "on-tertiary": "#FFFFFF",
                "tertiary-container": "#5B21B6",
                "on-tertiary-container": "#EDE9FE",

                "error": "#EF4444",
                "on-error": "#FFFFFF",
                
                "outline": "#3F3F46", // Zinc-700
                "outline-variant": "#52525B", // Zinc-600
                
                "glass-surface": "rgba(255, 255, 255, 0.03)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
                "glass-shadow": "rgba(0, 0, 0, 0.5)"
            },
            "borderRadius": {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.5rem",
                "full": "9999px"
            },
            "spacing": {
                "margin-mobile": "24px",
                "container-max": "1200px",
                "section-gap": "96px",
                "gutter": "32px",
                "section-gap-mobile": "64px"
            },
            "fontFamily": {
                // Moving to a more elegant serif/sans mix or keeping Inter clean but styling lighter
                "sans": ["Plus Jakarta Sans", "sans-serif"],
                "display": ["Outfit", "sans-serif"],
            },
            "boxShadow": {
                "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.04)",
                "glass-hover": "0 12px 40px 0 rgba(0, 0, 0, 0.08)",
            },
            "animation": {
                "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "float": "float 6s ease-in-out infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "blob": "blob 15s infinite alternate",
            },
            "keyframes": {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" }
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.8" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)", opacity: "1" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)", opacity: "0.7" },
                    "100%": { transform: "translate(0px, 0px) scale(1)", opacity: "0.8" }
                }
            }
        }
    },
    plugins: [],
}
