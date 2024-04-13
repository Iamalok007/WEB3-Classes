import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'buffer-polyfill';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  exclude: ['buffer'],
})
// vite.config.js

