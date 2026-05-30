import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Must match PORT in backend/.env (yours is 3001)
  const apiTarget = env.VITE_API_PROXY || "http://localhost:3001";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": apiTarget,
      },
    },
  };
});
