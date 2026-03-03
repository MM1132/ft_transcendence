import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

console.log(`Here is our VITE_ALLOWED_HOSTS: ${process.env.VITE_ALLOWED_HOSTS}`);

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    allowedHosts: [process.env.VITE_ALLOWED_HOSTS],
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  }
})
