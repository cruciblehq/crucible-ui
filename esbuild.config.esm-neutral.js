import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    platform: "neutral",
    bundle: true,
    sourcemap: true,
    define: {
        "process.env.NODE_ENV": '"development"',
    },
    tsconfig: "tsconfig.base.json",
    outdir: "dist/esm-neutral/",
    outbase: "src",
})
