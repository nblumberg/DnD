import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "iife",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      compilerOptions: {
        declaration: false,
        declarationDir: undefined,
        sourceMap: true,
      },
    }),
  ],
};
