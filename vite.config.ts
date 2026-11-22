import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// On Vercel, point the WhatsApp/Open Graph preview at the project's own
// production domain (e.g. https://sanaullah-birthday.vercel.app/).
if (process.env.VERCEL_PROJECT_PRODUCTION_URL && !process.env.VITE_SITE_URL) {
  process.env.VITE_SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
}

// base './' keeps asset paths relative, so the site works on any host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
})
