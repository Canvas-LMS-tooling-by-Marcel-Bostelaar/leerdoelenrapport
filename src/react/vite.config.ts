import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: "/src",
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: '../backend/public/static/react',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
      '/dev': {
        target: process.env.VITE_API_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
