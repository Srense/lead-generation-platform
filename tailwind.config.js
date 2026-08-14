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
                // iOS Liquid Glass Palette
                "background": "#F4F7FC", // Very soft, cool white-blue
                "on-background": "#1A233A",
                
                "surface": "#FFFFFF",
                "on-surface": "#1A233A",
                "surface-variant": "#EBF0F8",
                "on-surface-variant": "#4A5568",
                
                // Primary: Vibrant Ocean Blue / Indigo
                "primary": "#2563EB", // Bright Blue
                "on-primary": "#FFFFFF",
                "primary-container": "#DBEAFE",
                "on-primary-container": "#1E3A8A",

                // Secondary: Luminous Cyan / Teal
                "secondary": "#06B6D4", // Cyan
                "on-secondary": "#FFFFFF",
                "secondary-container": "#CFFAFE",
                "on-secondary-container": "#164E63",

                // Tertiary: Deep Violet / Purple
                "tertiary": "#8B5CF6", // Violet
                "on-tertiary": "#FFFFFF",
                "tertiary-container": "#EDE9FE",
                "on-tertiary-container": "#4C1D95",

                "error": "#EF4444",
                "on-error": "#FFFFFF",
                
                "outline": "#CBD5E1",
                "outline-variant": "#E2E8F0",
                
                "glass-surface": "rgba(255, 255, 255, 0.4)",
                "glass-border": "rgba(255, 255, 255, 0.7)",
                "glass-shadow": "rgba(37, 99, 235, 0.05)"
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
                "sans": ["Inter", "sans-serif"],
                "display": ["Inter", "sans-serif"],
            },
            "boxShadow": {
                "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.04)",
                "glass-hover": "0 12px 40px 0 rgba(0, 0, 0, 0.08)",
            },
            "animation": {
                "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "float": "float 6s ease-in-out infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            "keyframes": {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" }
                }
            }
        }
    },
    plugins: [],
}
