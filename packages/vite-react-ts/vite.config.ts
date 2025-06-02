import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // UnoCSS插件必须放在react插件之前
    UnoCSS(),
    react()
  ],
})
