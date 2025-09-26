import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('date-fns') || id.includes('uuid') || id.includes('crypto-js') || id.includes('bcryptjs')) {
              return 'utils';
            }
            return 'vendor';
          }
        },
      },
    },
    minify: 'terser',
  },
})
