import dts from "vite-plugin-dts";

import { playwright } from "@vitest/browser-playwright";

/**
 * @type {import('vite').UserConfig}
 *
 * @see https://vite.dev/config/
 * @see https://vitest.dev/config/
 * @see https://github.com/qmhc/unplugin-dts
 */
export default {
  plugins: [
    dts({
      tsconfigPath: "./lib/tsconfig.json",
      outDirs: "./dist/types",
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    dir: "test",
    passWithNoTests: true,
    setupFiles: "test/setup.ts",
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }, { browser: "firefox" }],
      isolate: false,
    },
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: [
        "lib/html/02-infrastructure/06-common-dom-interfaces/01-reflecting-content-attributes-in-idl-attributes",
        "lib/webidl/02-idl/02-idl-interfaces/**/*.ts",
        "lib/webidl/02-idl/05-idl-members/*.ts",
        "lib/webidl/02-idl/05-idl-members/04-idl-constructors/**/*.ts",
        "lib/webidl/02-idl/05-idl-members/08-idl-overloading/**/*.ts",
        "lib/webidl/02-idl/07-idl-static-attributes-and-operations/**/*.ts",
        "lib/webidl/03-javascript-binding/02-js-type-mapping/**/*.ts",
        "lib/webidl/03-javascript-binding/03-js-extended-attributes/**/*.ts",
        "lib/webidl/03-javascript-binding/04-js-legacy-extended-attributes/**/*.ts",
        "lib/webidl/03-javascript-binding/06-dfn-overload-resolution-algorithm/**/*.ts",
      ],
      thresholds: {
        100: true,
      },
      reporter: "text",
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: [
        "./lib/dom/index.ts",
        "./lib/ecma/index.ts",
        "./lib/html/index.ts",
        "./lib/infra/index.ts",
        "./lib/share/index.ts",
        "./lib/url/index.ts",
        "./lib/webidl/index.ts",
      ],
    },
    rolldownOptions: {
      output: [
        {
          format: "es",
          dir: "dist/lib",
          entryFileNames: "[name].js",
          preserveModules: true,
          preserveModulesRoot: "lib",
          minify: false,
        },
      ],
    },
  },
};
