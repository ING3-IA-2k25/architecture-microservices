// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/vite/dist/node/index.js";
import vue from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import UnoCSS from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/unocss/dist/vite.mjs";
import presetCatppuccin from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/unocss-preset-catppuccin/dist/index.mjs";
import { presetUno } from "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/node_modules/unocss/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///home/nico/Documents/Ing3/AM/architecture-microservices/front/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    UnoCSS({
      presets: [
        presetUno(),
        presetCatppuccin()
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uaWNvL0RvY3VtZW50cy9JbmczL0FNL2FyY2hpdGVjdHVyZS1taWNyb3NlcnZpY2VzL2Zyb250XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uaWNvL0RvY3VtZW50cy9JbmczL0FNL2FyY2hpdGVjdHVyZS1taWNyb3NlcnZpY2VzL2Zyb250L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25pY28vRG9jdW1lbnRzL0luZzMvQU0vYXJjaGl0ZWN0dXJlLW1pY3Jvc2VydmljZXMvZnJvbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcblxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBwcmVzZXRDYXRwcHVjY2luIGZyb20gJ3Vub2Nzcy1wcmVzZXQtY2F0cHB1Y2NpbidcbmltcG9ydCB7IHByZXNldFVubyB9IGZyb20gJ3Vub2NzcydcblxuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVEZXZUb29scygpLFxuICAgIFVub0NTUyh7XG4gICAgICAgIHByZXNldHM6IFtcbiAgICAgICAgICBwcmVzZXRVbm8oKSxcbiAgICAgICAgICBwcmVzZXRDYXRwcHVjY2luKClcbiAgICAgICAgXVxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlXLFNBQVMsZUFBZSxXQUFXO0FBRTVZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUV4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxzQkFBc0I7QUFDN0IsU0FBUyxpQkFBaUI7QUFSd00sSUFBTSwyQ0FBMkM7QUFZblIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ1AsVUFBVTtBQUFBLFFBQ1YsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
