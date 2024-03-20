import fs from 'node:fs'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import {ConfigEnv, loadEnv, UserConfig} from "vite";
import Components from "unplugin-vue-components/vite";
import {createVitePlugins} from "./build/plugins";
import AutoImport from "unplugin-auto-import/vite";
import {wrapperEnv} from "./build/getEnv";
import {resolve} from "path";
import {createProxy} from "./build/proxy";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/var.scss";`
        }
      }
    },
    plugins: [
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
      ...createVitePlugins(viteEnv),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: "./.eslintrc-auto-import.json", // 生成json文件
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    // server: process.env.VSCODE_DEBUG && (() => {
    //   const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
    //   return {
    //     host: url.hostname,
    //     port: +url.port,
    //   }
    // })(),
    clearScreen: false,
  }
})
