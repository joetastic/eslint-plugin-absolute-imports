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

## License

MIT
