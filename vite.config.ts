import {defineConfig} from "vite";
import {fileURLToPath,URL} from "node:url";
export default defineConfig({base:"/trackflow-cms-demo/",resolve:{alias:{"next/navigation":fileURLToPath(new URL("./src/hosting/navigation.tsx",import.meta.url)),"next/link":fileURLToPath(new URL("./src/hosting/navigation.tsx",import.meta.url)),"@":fileURLToPath(new URL("./src",import.meta.url))}},esbuild:{jsx:"automatic"},build:{outDir:"dist"}});
