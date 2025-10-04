"use strict";

const fs = require("fs");
const path = require("path");
let parseJsonc;

try {
  // Lazy load so requiring the plugin does not throw if dependency resolution is odd during installation.
  ({ parse: parseJsonc } = require("jsonc-parser"));
} catch (e) {
  // Fallback: define a minimal comment stripper if dependency missing (should not happen after install)
  parseJsonc = function (text) {
    // Remove // and /* */ comments very naively as a last resort.
    const withoutLine = text.replace(/(^|\s)\/\/.*$/gm, "");
    const withoutBlock = withoutLine.replace(/\/\*[\s\S]*?\*\//g, "");
    return JSON.parse(withoutBlock);
  };
}

function has(map, path) {
  let inner = map;
  for (let step of path.split(".")) {
    inner = inner[step];
    if (inner === undefined) {
      return false;
    }
  }
  return true;
}

function findDirWithFile(filename) {
  let dir = path.resolve(filename);

  do {
    dir = path.dirname(dir);
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== "/");

  if (!fs.existsSync(path.join(dir, filename))) {
    return;
  }

  return dir;
}

function getBaseUrl(baseDir) {
  let url = "";
  const tryFiles = ["tsconfig.json", "jsconfig.json"];
  for (const filename of tryFiles) {
    const full = path.join(baseDir, filename);
    if (!fs.existsSync(full)) continue;
    try {
      const raw = fs.readFileSync(full, "utf8");
      const data = parseJsonc(raw);
      if (data && has(data, "compilerOptions.baseUrl")) {
        url = data.compilerOptions.baseUrl;
        break;
      }
    } catch (e) {
      // Swallow parse errors – rule will just not transform if baseUrl unknown.
      continue;
    }
  }

  return path.join(baseDir, url);
}

module.exports.rules = {
  "only-absolute-imports": {
    meta: {
      fixable: true,
    },
    create: function (context) {
      const baseDir = findDirWithFile("package.json");
      const baseUrl = getBaseUrl(baseDir);
      const options =
        context.options && context.options[0] ? context.options[0] : {};
      const prefix = typeof options.prefix === "string" ? options.prefix : "";

      return {
        ImportDeclaration(node) {
          const source = node.source.value;
          if (source.startsWith("..")) {
            const filename = context.getFilename();
            const absolutePath = path.normalize(
              path.join(path.dirname(filename), source)
            );
            let expectedPath = path.relative(baseUrl, absolutePath);
            if (expectedPath === "") expectedPath = ".";
            if (prefix) {
              expectedPath =
                prefix.replace(/\/$/, "") + expectedPath.replace(/^\.\/?/, "");
            }

            if (source !== expectedPath) {
              context.report({
                node,
                message: `Relative imports are not allowed. Use \`${expectedPath}\` instead of \`${source}\`.`,
                fix: function (fixer) {
                  return fixer.replaceText(node.source, `'${expectedPath}'`);
                },
              });
            }
          }
        },
      };
    },
  },
};
