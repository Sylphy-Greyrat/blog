import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { getDirname, path } from "@vuepress/utils";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
    alias: {
        "@theme-hope/modules/blog/components/BlogHero": path.resolve(__dirname, "./components/BlogHero.vue"),
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
        docsearchPlugin({
            appId: "CJHTES6ZNV",
            apiKey: "30252943786fb72756df73609c52f61a",
            indexName: "ozh",
            locales: {
                "/": {
                    placeholder: "搜索文档",
                    translations: {
                        button: {
                            buttonText: "搜索文档",
                            buttonAriaLabel: "搜索文档",
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: "清除查询条件",
                                resetButtonAriaLabel: "清除查询条件",
                                cancelButtonText: "取消",
                                cancelButtonAriaLabel: "取消",
                            },
                            startScreen: {
                                recentSearchesTitle: "搜索历史",
                                noRecentSearchesText: "没有搜索历史",
                                saveRecentSearchButtonTitle: "保存至搜索历史",
                                removeRecentSearchButtonTitle: "从搜索历史中移除",
                                favoriteSearchesTitle: "收藏",
                                removeFavoriteSearchButtonTitle: "从收藏中移除",
                            },
                            errorScreen: {
                                titleText: "无法获取结果",
                                helpText: "你可能需要检查你的网络连接",
                            },
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                                closeText: "关闭",
                                searchByText: "搜索提供者",
                            },
                            noResultsScreen: {
                                noResultsText: "无法找到相关结果",
                                suggestedQueryText: "你可以尝试查询",
                                reportMissingResultsText: "你认为该查询应该有结果？",
                                reportMissingResultsLinkText: "点击反馈",
                            },
                        },
                    },
                }
            }
        })
    ],
    head: [
        // 导入相应链接
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        [
            "link",
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap", rel: "stylesheet",
            },
        ],
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        [
            "link",
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap",
                rel: "stylesheet",
            },
        ],
        [
            'link', { href: "https://cdn.jsdelivr.net/npm/@docsearch/css@3", rel: "stylesheet" }
        ],
        [
            'script', { src: "https://cdn.jsdelivr.net/npm/@docsearch/js@3" }
        ],
    ],
    // Enable it with pwa
    // shouldPrefetch: false,
});
