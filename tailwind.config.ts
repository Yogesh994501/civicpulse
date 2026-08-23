import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: {
          DEFAULT: "#09090B",
          secondary: "#121216",
          tertiary: "#18181F",
          card: "#0E0E14",
        },
        civic: {
          road: "#F59E0B",
          waste: "#10B981",
          lighting: "#06B6D4",
          park: "#F43F5E",
          critical: "#EF4444",
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ripple-fast': 'ripple 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'ripple-med': 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'ripple-slow': 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
