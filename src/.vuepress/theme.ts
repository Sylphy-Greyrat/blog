import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import {MR_HOPE_AVATAR} from "./logo.js";

export default hopeTheme({
        // backToTop: undefined,
        breadcrumb: true,
        breadcrumbIcon: true,
        contributors: false,
        copyright: undefined,
        editLink: false,
        editLinkPattern: "",
        extraLocales: undefined,
        favicon: "",
        fullscreen: false,
        home: "",
        hotReload: false,
        lastUpdated: false,
        logoDark: "",
        navbarTitle: '',
        nextLink: true,
        outlookLocales: undefined,
        pageInfo: undefined,
        prevLink: true,
        print: false,
        pure: false,
        repoDisplay: false,
        repoLabel: "",
        rtl: false,
        sidebarSorter: undefined,
        themeColor: true,
        titleIcon: true,
        hostname: "https://mister-hope.github.io",
        toc: {
            levels: [2, 4]
        },

        darkmode: "toggle",

        author: {
            name: "Mr.O",
            // url: "https://mister-hope.com",
        },

        logo: "/logo.svg",

        repo: "home/git/repos",

        docsDir: "src",

        // 导航栏
        navbar,

        // 侧边栏
        sidebar,

        // footer: "默认页脚",

        displayFooter: true,

        // 博客相关
        blog: {
            description: "一个初学者",
            intro: "/intro.html",
            avatar: "/logo.png",
            medias: {
                Baidu: "https://baidu.com",
                BiliBili: "https://bilibili.com",
                Bitbucket: "https://example.com",
                Dingding: "https://example.com",
                Discord: "https://discord.com",
                Dribbble: "https://example.com",
                Email: "https://mail.google.com",
                Evernote: "https://example.com",
                Facebook: "https://example.com",
                Flipboard: "https://example.com",
                Gitee: "https://gitee.com",
                GitHub: "https://github.com",
                Gitlab: "https://example.com",
                Gmail: "mailto:info@example.com",
                Instagram: "https://example.com",
                Lark: "https://example.com",
                Lines: "https://example.com",
                Linkedin: "https://example.com",
                Pinterest: "https://example.com",
                Pocket: "https://example.com",
                QQ: "https://qq.com",
                Qzone: "https://example.com",
                Reddit: "https://example.com",
                Rss: "https://example.com",
                Steam: "https://steam.com",
                Twitter: "https://twitter.com",
                Wechat: "https://weixin.qq.com",
                Weibo: "https://example.com",
                Whatsapp: "https://example.com",
                Youtube: "https://example.com",
                Zhihu: "https://example.com",
                MrHope: {
                    icon: MR_HOPE_AVATAR,
                    link: "https://mister-hope.com",
                },
            },
        },

        // 加密配置
        encrypt: {
            config: {
                "/demo/encrypt.html": {
                    hint: "Password: 1234",
                    password: "1234",
                },
            },
        },

        // 多语言配置
        metaLocales: {
            editLink: "在 GitHub 上编辑此页",
        },

        // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
        // hotReload: true,

        // 此处开启了很多功能用于演示，你应仅保留用到的功能。
        markdown: {
            component: true,
            footnote: true,
            align: true,
            attrs: true,
            chartjs: true,
            codeTabs: true,
            demo: true,
            echarts: true,
            figure: true,
            flowchart: true,
            gfm: true,
            imgLazyload: true,
            imgSize: true,
            include: true,
            math: {
                type: "katex"
            },
            mark: true,
            mermaid: true,
            playground: {
                presets: ["ts", "vue"],
            },
            revealjs: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({tag}) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: {type: "tip"},
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
            // install chart.js before enabling it
            // chart: true,

            // insert component easily

            // install echarts before enabling it
            // echarts: true,

            // install flowchart.ts before enabling it
            // flowchart: true,

            // gfm requires mathjax-full to provide tex support
            // gfm: true,

            // install katex before enabling it
            // katex: true,

            // install mathjax-full before enabling it
            // mathjax: true,

            // install mermaid before enabling it
            // mermaid: true,

            // playground: {
            //   presets: ["ts", "vue"],
            // },

            // install reveal.js before enabling it
            // revealJs: {
            //   plugins: ["highlight", "math", "search", "notes", "zoom"],
            // },

            // install @vue/repl before enabling it
            // vuePlayground: true,
        },

        // meilisearch: {
        //     host: 'http://101.43.49.28:7700/',
        //     apiKey: '0f2bfd2315ed355437466b3137d39eb191a5edfede11d48be25796f4cc413902',
        //     indexUid: '986f11fc-15a0-4e9b-9763-c0719ad9cb63',
        // },

        // 在这里配置主题提供的插件
        plugins: {
            sitemap: true,
            blog: true,
            seo: true,
            components: {
                components: [
                    "PDF",
                    "Badge",
                    "VPCard"
                ]
            },
            // 启用之前需安装 @waline/client
            // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
            // comment: {
            //   provider: "Waline",
            //   serverURL: "https://waline-comment.vuejs.press",
            // },

            docsearch:{
                appId: "CJHTE216ZNV",
                apiKey: "30252943786fb72756d43609c52f61a",
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
            },

            icon: {
                assets: ["//at.alicdn.com/t/c/font_4356167_1vcamcuhx6n.css","fontawesome-with-brands"],
            },

            // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
            // pwa: {
            //   favicon: "/favicon.ico",
            //   cacheHTML: true,
            //   cacheImage: true,
            //   appendBase: true,
            //   apple: {
            //     icon: "/assets/icon/apple-icon-152.png",
            //     statusBarColor: "black",
            //   },
            //   msTile: {
            //     image: "/assets/icon/ms-icon-144.png",
            //     color: "#ffffff",
            //   },
            //   manifest: {
            //     icons: [
            //       {
            //         src: "/assets/icon/chrome-mask-512.png",
            //         sizes: "512x512",
            //         purpose: "maskable",
            //         type: "image/png",
            //       },
            //       {
            //         src: "/assets/icon/chrome-mask-192.png",
            //         sizes: "192x192",
            //         purpose: "maskable",
            //         type: "image/png",
            //       },
            //       {
            //         src: "/assets/icon/chrome-512.png",
            //         sizes: "512x512",
            //         type: "image/png",
            //       },
            //       {
            //         src: "/assets/icon/chrome-192.png",
            //         sizes: "192x192",
            //         type: "image/png",
            //       },
            //     ],
            //     shortcuts: [
            //       {
            //         name: "Demo",
            //         short_name: "Demo",
            //         url: "/demo/",
            //         icons: [
            //           {
            //             src: "/assets/icon/guide-maskable.png",
            //             sizes: "192x192",
            //             purpose: "maskable",
            //             type: "image/png",
            //           },
            //         ],
            //       },
            //     ],
            //   },
            // },
        },
    },
    {
        custom: true
    }
);
