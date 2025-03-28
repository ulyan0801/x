import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import * as path from "path";
import path from 'path' //引入path模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {                
    host: '0.0.0.0'   
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  }
})

