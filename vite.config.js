import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from external hosts (e.g., ngrok)
    port: 5173,
    allowedHosts: [
      'localhost',
      'a50d-2405-4802-1bec-5ac0-5ed3-c71e-3d21-4938.ngrok-free.app', // Add your ngrok URL
    ],
  },
});