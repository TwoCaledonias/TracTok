module.exports = {
  // Lint & format TypeScript and JavaScript files
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `pnpm eslint --fix ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],

  // Format other files
  "**/*.{json,css,md}": (filenames) => `pnpm prettier --write ${filenames.join(" ")}`,

  // Type check TypeScript files
  "**/*.{ts,tsx}": () => "pnpm type-check",
};
