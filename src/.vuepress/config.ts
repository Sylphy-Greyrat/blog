import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
    alias: {
        "@theme-hope/modules/blog/components/BlogHero": path.resolve(
            __dirname,
            "./components/BlogHero.vue",
        ),
    },
    base: "/",

    lang: "zh-CN",
    description: "ozh 的博客",
    markdown: {
        headers: {
            level: [2, 3, 4, 5]
        }
    },

    theme,

    plugins: [
        // registerComponentsPlugin({}),
        // autoCatalogPlugin({}),
    ],
    head: [
        [
            'link', {href: "https://cdn.jsdelivr.net/npm/@docsearch/css@3", rel: "stylesheet"}
        ],
        [
            'script', {src: "https://cdn.jsdelivr.net/npm/@docsearch/js@3"}
        ],
        // 线上字体的链接
        ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
        [
            "link",
            {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""},
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap",
                rel: "stylesheet",
            },
        ],
    ],
    // 和 PWA 一起启用
    // shouldPrefetch: false,
});
