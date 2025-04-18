import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Allows access from other devices
    port: 5173, // Ensure the port is correct
    allowedHosts: ['fundpulse-frontend1.onrender.com']
  },
  
});
