import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gothic: ['Playfair Display', 'serif'],
        creepy: ['Special Elite', 'cursive'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        haunted: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
          accent: '#8B0000',
          highlight: '#FF0000',
          secondary: '#1C1C1C',
          tertiary: '#2C2C2C',
          danger: '#FF0000',
          overlay: '#000000e6',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.92' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow': {
          '0%, 100%': { textShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '50%': { textShadow: '0 0 10px rgba(139, 92, 246, 0.8)' },
        },
        'blood-drip': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        'pulse-blood': {
          '0%, 100%': { opacity: '1', backgroundColor: '#8B0000' },
          '50%': { opacity: '0.8', backgroundColor: '#FF0000' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flicker': 'flicker 4s linear infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'blood-drip': 'blood-drip 2s ease-in-out infinite',
        'pulse-blood': 'pulse-blood 3s ease-in-out infinite',
      },
      backgroundImage: {
        'haunted-texture': "url('/images/haunted-texture.png')",
        'dark-gradient': 'linear-gradient(to bottom, #1A1F2C, #121420)',
        'bloody-texture': 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/images/blood-splatter.png")',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
