import { defineConfig } from "orval";

export default defineConfig({
  runningApp: {
    input: "http://localhost:3001/api/docs-json",
    output: {
      mode: "tags-split",
      target: "./src/lib/api/generated/endpoints.ts",
      schemas: "./src/lib/api/generated/models",
      client: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "./src/lib/api/mutator.ts",
          name: "customFetch",
        },
      },
    },
  },
});
