import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` permet d'ouvrir le build depuis n'importe quel sous-dossier.
export default defineConfig({
  plugins: [react()],
  base: './',
})
