# Copilot Instructions for `eslint-plugin-absolute-imports`

## Project Overview

- This is a zero-dependency ESLint plugin enforcing absolute imports in JavaScript/TypeScript projects.
- It requires a `baseUrl` in `tsconfig.json` or `jsconfig.json` (does **not** support `paths`).
- The main logic is in `index.js`.

## Key Patterns & Conventions

- The plugin exposes a single rule: `only-absolute-imports`.
- All code should avoid relative imports (e.g., `./foo` or `../bar`).
- No external dependencies are used—keep the code dependency-free.
- Follow ESLint plugin conventions for rule definition and export structure.

## Developer Workflows

- Install with: `npm i --save-dev eslint-plugin-absolute-imports`
- Add to ESLint config:
  - `plugins: ["absolute-imports"]`
  - `rules: { "absolute-imports/only-absolute-imports": "error" }`
- No build step is required; code is plain JavaScript.
- No test suite is present—add tests if expanding functionality.

## Integration Points

- Integrates with ESLint as a plugin.
- Expects consuming projects to have a `baseUrl` set in their config.

## Examples

- See `index.js` for the rule implementation.
- See `README.md` for installation and usage instructions.

## Special Notes

- Do not add dependencies.
- Do not implement support for `paths` in config.
- Keep the plugin minimal and focused on enforcing absolute imports only.
