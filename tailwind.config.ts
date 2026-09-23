import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/admin/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
