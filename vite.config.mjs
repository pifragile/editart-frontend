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
  plugins: [react()],
});