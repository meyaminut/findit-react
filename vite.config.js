import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dns from 'node:dns'
import https from 'node:https'

// Force IPv4-first DNS resolution
dns.setDefaultResultOrder('ipv4first')

// Custom HTTPS agent that forces the correct SNI servername
// so nginx on the backend can route the request properly
const proxyAgent = new https.Agent({
  rejectUnauthorized: false,
  servername: '139-190-96-203.sslip.io',
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/findit/api': {
        target: 'https://139.190.96.203',
        changeOrigin: true,
        secure: false,
        agent: proxyAgent,
        headers: {
          Host: '139-190-96-203.sslip.io',
        },
      },
    },
  },
})
