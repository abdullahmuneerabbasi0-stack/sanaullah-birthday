import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' keeps asset paths relative, so the site works on GitHub Pages
// under any repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
