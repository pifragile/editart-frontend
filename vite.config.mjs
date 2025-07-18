import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    global: "globalThis", // Required for many polyfills
    "process.env": {},    // Needed for libraries like react-tweet-embed
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      util: "util",
      assert: "assert",
    },
  },
  optimizeDeps: {
    include: [
      "buffer",
      "process",
      "stream-browserify",
      "crypto-browserify",
      "util",
      "assert",
    ],
  },
  server: {
    host: true, // ← important: allows external access
    strictPort: true, // optional, ensures consistent port
    port: 5173, // or whatever you use
    hmr: {
      host: '63395d688f5a.ngrok-free.app',
    },
    cors: true,
  },
  plugins: [react()],
});