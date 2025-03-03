import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import legacyPlugin from "@vitejs/plugin-legacy";
import viteCompression from "vite-plugin-compression";

const postCssPxToRem = require("postcss-pxtorem");
const {visualizer} = require("rollup-plugin-visualizer");
const minimist = require('minimist');
const path = require('path')
const fs = require("fs");
const dotenv = require("dotenv");

export default ({command, mode}: any) => {
    const isProduction = mode === 'production'
    const envConfig = dotenv.parse(fs.readFileSync(`.env.${mode}`));
    // https://vitejs.dev/config/
    return defineConfig({
        // 项目根目录
        root: process.cwd(),
        // 在生产中服务时的基本公共路径
        base: isProduction ? '/' : '',
        // 配置中指明将会把 serve 和 build 时的模式都覆盖掉,serve 时默认 'development'，build 时默认 'production'
        mode,
        // 在开发时会被定义为全局变量，而在构建时则是静态替换
        // define: '',
        // 静态资源服务的文件夹
        publicDir: 'assets',
        resolve: {
            extensions: ['.ts', '.js', '.vue', '.json', '.jsx', '.tsx'],
            // 目录别名
            alias: {
                '@': path.resolve(__dirname, './src'),
            }
        },
        // CSS 预处理器
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@import './src/assets/css/variables.scss';"
                }
                ,
                less: {
                    javascriptEnabled: true
                }
            },
            postcss: {
                plugins: [
                    // require('autoprefixer')
                    // postCssPxToRem({
                    //     rootValue: 192,
                    //     propList: ["*"],
                    // }),
                ]
            }
        },
        server: {
            // 是否自动打开浏览器
            open: false,
            // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
            host: '0.0.0.0',
            // 服务器端口号
            port: 3000,
            // 设为 true ,若端口已被占用则会直接退出，而不是尝试下一个可用端口
            strictPort: false,
            // 为开发服务器配置 CORS
            cors: true,
            // 设置为 true 强制使依赖预构建
            force: true,
            proxy: {
                '/api': {
                    target: envConfig.VITE_APP_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        // build
        build: {
            minify: "esbuild",
            assetsDir: "assets",
            outDir: `./dist`,
            // 进行压缩计算
            brotliSize: false,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    chunkFileNames: "static/js/[name]-[hash].js",
                    entryFileNames: "static/js/[name]-[hash].js",
                    assetFileNames: "static/[ext]/[name]-[hash].[ext]",
                },
            },
            sourcemap: false,
            reportCompressedSize: false,
        },
        // ssr: false,
        // 将要用到的插件数组
        plugins: [
            vue(),
            legacyPlugin({
                targets: ["> 1%, last 1 version, ie >= 11"],
            }),
            viteCompression({
                verbose: true,
                disable: false, // 不禁用压缩
                deleteOriginFile: false, // 压缩后是否删除原文件
                threshold: 10240, // 压缩前最小文件大小
                algorithm: "gzip", // 压缩算法
                ext: ".gz", // 文件类型
            }),
            visualizer({open: false}) // 自动开启分析页面
        ]

    })
}
