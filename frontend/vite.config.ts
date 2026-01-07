// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"], // Critical fix 1
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"), // Critical fix 2
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"), // Critical fix 3
    },
  },
});
