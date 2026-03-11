import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F6F2EA",
        sand: "#E7D9C8",
        ink: "#1F1C17",
        terracotta: "#C65D3A",
        olive: "#7A7F4F"
      },
      fontFamily: {
        display: ["\"Playfair Display\"", "serif"],
        body: ["\"Manrope\"", "sans-serif"]
      },
      boxShadow: {
        card: "0 20px 45px -30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
