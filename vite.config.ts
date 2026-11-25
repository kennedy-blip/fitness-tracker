import { execFileSync } from "node:child_process";
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const site = fileURLToPath(new URL("./static-site/", import.meta.url));
const generated = fileURLToPath(new URL("./static-site/dist/", import.meta.url));
const output = fileURLToPath(new URL("./dist/", import.meta.url));

// Render invokes Vite directly, bypassing npm's build script and lifecycle hooks.
export default defineConfig(({ command }) => {
  if (command === "build") {
    execFileSync("bash", ["build-for-render.sh"], { cwd: site, stdio: "inherit" });
  }
  return {
    root: generated,
    base: "./",
    publicDir: false,
    build: { outDir: output, emptyOutDir: true, assetsInlineLimit: 0 },
    plugins: [{
      name: "publish-fitness-data",
      writeBundle() {
        cpSync(`${generated}data`, `${output}data`, { recursive: true });
      },
    }],
  };
});
