import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "postprocessing.min": "src/api/postprocessing.min.js"
    }
  },
  optimizeDeps: {
    include: ["postprocessing.min"]
  }
})
