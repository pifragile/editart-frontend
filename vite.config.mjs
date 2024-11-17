import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            protocolImports: true, // Enables polyfills for Node.js built-ins
        }),
    ],
    resolve: {
      alias: {
        stream: 'stream-browserify', // Example alias if needed
        crypto: 'crypto-browserify',
        buffer: 'buffer',
      },
    },
    define: {
      global: 'window', // Ensure `global` is defined
    },
    base: "/",
});
