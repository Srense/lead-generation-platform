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
                // Floral elegant palette
                "background": "#FAFAFA", // Very soft, clean white
                "on-background": "#2C2C2C",
                
                "surface": "#FFFFFF",
                "on-surface": "#2C2C2C",
                "surface-variant": "#F2F0ED",
                "on-surface-variant": "#595959",
                
                // Primary: Soft Rose / Peony
                "primary": "#D98C8C",
                "on-primary": "#FFFFFF",
                "primary-container": "#FAD4D4",
                "on-primary-container": "#4A1C1C",

                // Secondary: Sage / Leaf Green
                "secondary": "#A3B899",
                "on-secondary": "#FFFFFF",
                "secondary-container": "#DCE8D6",
                "on-secondary-container": "#2A3822",

                // Tertiary: Warm Sand / Gold
                "tertiary": "#D4B483",
                "on-tertiary": "#FFFFFF",
                "tertiary-container": "#F5E6CD",
                "on-tertiary-container": "#3D2E14",

                "error": "#B85C5C",
                "on-error": "#FFFFFF",
                
                "outline": "#D1CFC9",
                "outline-variant": "#E8E6E1",
                
                "glass-surface": "rgba(255, 255, 255, 0.6)",
                "glass-border": "rgba(255, 255, 255, 0.8)",
                "glass-shadow": "rgba(0, 0, 0, 0.03)"
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
