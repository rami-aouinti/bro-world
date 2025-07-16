import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],

  build: {
    chunkSizeWarningLimit: 1000,
  },
})
