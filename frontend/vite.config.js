import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': 'http://localhost:5000', // backend API proxy
=======
      "/api": "http://localhost:3001", // backend API proxy (must match backend PORT in .env)
>>>>>>> b98d8e88a92d807bf606d53dedef94d41e7994c0
    },
  },
});
