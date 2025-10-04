# eslint-plugin-absolute-imports

A (zero-dependency!) eslint plugin that enforces absolute imports on your codebase.

## Prerequisites

You must have a `baseUrl` defined in either `tsconfig.json` or `jsconfig.json`. **This plugin does not currently work with `paths`!**

## Setup

- `npm i --save-dev eslint-plugin-absolute-imports`
- Add `eslint-plugin-absolute-imports` to your eslint `plugins` section
- Add `absolute-imports/only-absolute-imports` to your eslint `rules` section

## Rule Options

You can provide an optional `prefix` argument to prepend a string to all absolute imports. This is useful if your project expects all absolute imports to start with a specific prefix (e.g., `@/`).

**Example ESLint config:**

```json
{
  "plugins": ["absolute-imports"],
  "rules": {
    "absolute-imports/only-absolute-imports": ["error", { "prefix": "@" }]
  }
}
```

With this config, a relative import like `import foo from "./foo"` will be auto-fixed to `import foo from "@/foo"`.

## Automated Releases

Releases are automated via a GitHub Actions workflow (`.github/workflows/release.yml`) that runs on every push to `master`:

- Determines the next semantic version by inspecting commit messages since the last tag.
  - `feat:` triggers a minor bump.
  - `BREAKING CHANGE` in any commit body triggers a major bump.
  - Otherwise a patch bump.
- Updates `package.json` and prepends a section to `CHANGELOG.md` with the commit subjects.
- Creates a git tag `vX.Y.Z` and publishes the package to npm.
- Creates a GitHub Release.

### Requirements

1. Add an `NPM_TOKEN` secret (npm automation token with publish rights) in your repository settings under Settings > Secrets and variables > Actions.
2. Use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`, `chore:`, etc.) so version bumps work as expected.
3. Push changes directly to `master` (or merge PRs) and the workflow will handle the rest.

### Manual Fallback

If you ever need to publish manually:

```bash
npm version patch   # or minor / major
npm publish --access public
git push --follow-tags
```

## License

MIT
