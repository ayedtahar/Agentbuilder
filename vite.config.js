import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Chemins relatifs : le build doit pouvoir tourner depuis n'importe quel
  // sous-chemin d'hébergement, pas seulement la racine d'un domaine.
  base: './',
  plugins: [react()],
})
