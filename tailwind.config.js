/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        // Mystic Circuit Bloom Palette
        'cyber-green-dark': '#0A2624', // Primary Background
        'cyber-green-mid': '#143D3C',  // Section/Panel Background
        'lavender-pink': '#FF00FF',   // Soft Accent 1 (The refined pink)
        'mystic-teal': '#8DD0CE',     // Soft Accent 2
        'orchid-purple': '#6F4F8A',   // Depth Accent
        'pale-glow': '#E0E0E0',       // Text Color
        'link-glow': '#5FC0A8',       // Link/Interactive Highlight
      },
      // ... inside module.exports = { theme: { extend: { ... } } }
fontFamily: {
    // Changed primary font to Tenor Sans for a more dainty/elegant look
    sans: ['Tenor Sans', 'sans-serif'], 
    mono: ['Fira Code', 'monospace'], 
    'serif-dainty': ['Lora', 'serif'],  
},
    },
  },
  plugins: [],
}