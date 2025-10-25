// import tailwindcss from '@tailwindcss/vite'
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),tailwindcss(),
//   ],

//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//       }
//     }
//   }

//   // build: {
//   //   outDir: 'dist',
//   //   assetsDir: 'assets',
//   // },
// })

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },

  preview: {
    allowedHosts: ['techfluent.onrender.com'], // 👈 allows your Render domain
    host: true, // binds to 0.0.0.0 (needed for Render)
    port: 10000 // same port you used in Render start command
  }
})
