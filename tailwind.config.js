// tailwind.config.ts or .js
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", ...fontFamily.sans], // replaces default sans
        manrope: ["Manrope", "sans-serif"],    // optional alias
      },
    },
  },
}
