import { defineConfig } from "vite";
import { resolve, relative, extname } from "path";
import { globSync } from "glob";
import { fileURLToPath } from "node:url";

const root = resolve(__dirname, "src");

// 全てのアセットファイルを取得する関数
const getAllAssets = () => {
  return Object.fromEntries(
    globSync("src/assets/**/*.*", { 
      ignore: [
        "src/assets/js/**/*", 
        "src/assets/style/**/*",
        "src/assets/images/**/*" // 画像ファイルを除外
      ] 
    }).map((file) => [
      relative(
        "src/assets",
        file.slice(0, file.length - extname(file).length)
      ),
      fileURLToPath(new URL(file, import.meta.url))
    ])
  );
};

// WordPress用ビルドのinput設定
const inputsForWordPress = {
  style: resolve(root, "/assets/style/style.scss"),
  ...Object.fromEntries(
    globSync("src/assets/js/*.js").map((file) => [
      relative(
        "src/assets/js",
        file.slice(0, file.length - extname(file).length),
      ),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  ),
  ...getAllAssets(),
};

// 静的開発用のinput設定
const inputsForStatic = {
  style: resolve(root, "/assets/style/style.scss"),
  ...Object.fromEntries(
    globSync("src/**/*.html").map((file) => [
      relative("src", file.slice(0, file.length - extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  ),
  ...getAllAssets(),
};

export default defineConfig(({ mode }) => ({
  root,
  base: "./",
  server: {
    port: 5173,
    origin: mode == "wp" ? undefined : "http://localhost:5173",
  },
  assetsInclude: ["**/*.bin", "**/*.glb", "**/*.gltf"], // 3Dモデル関連ファイルをアセットとして扱う
  build: {
    outDir:
      mode === "wp"
        ? resolve(__dirname, "wordpress/themes/TEMPLATE_NAME/")
        : resolve(__dirname, "dist"),
    rollupOptions: {
      input: mode === "wp" ? inputsForWordPress : inputsForStatic,
      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name].[ext]';
          
          if (name === "style.css") {
            return "assets/style/[name].[ext]";
          } 
          
          // 画像ファイルの処理
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(name)) {
            return "assets/images/[name].[ext]";
          }
          
          // 3Dモデル関連ファイルの処理
          if (/\.(bin|glb|gltf)$/.test(name)) {
            return "assets/models/[name].[ext]";
          }
          
          // JSファイルの処理
          if (/\.(js|ts)$/.test(name)) {
            return "assets/js/[name].[ext]";
          }
          
          // その他のファイル
          return "assets/[name].[ext]";
        },
      },
    },
  },
}));