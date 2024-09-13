/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        // => @media (min-width: 640px) { ... }
        md: '768px',
        // => @media (min-width: 768px) { ... }
        lg: '1024px',
        // => @media (min-width: 1024px) { ... }
        xl: '1280px',
        // => @media (min-width: 1280px) { ... }
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
        '3xl': '1920px',
        // => @media (min-width: 1920px) { ... }
        '4xl': '2560px',
        // => @media (min-width: 2560px) { ... }
        '5xl': '3440px',
        // => @media (min-width: 3440px) { ... }
        '6xl': '3840px',
        // => @media (min-width: 3840px) { ... }
      },
      colors: {
        white: "#FFFFFF",
        slate: "#69737C",
        mouse: "#E1E1E1",
        charcoal: "#222526",
      },
    },
  },
  plugins: [],
}

