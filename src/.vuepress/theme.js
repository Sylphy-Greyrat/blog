import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { MR_HOPE_AVATAR } from "./logo.js";
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
    navTitle: undefined,
    navbarIcon: true,
    nextLink: true,
    outlookLocales: undefined,
    pageInfo: undefined,
    prevLink: true,
    print: false,
    pure: false,
    repoDisplay: false,
    repoLabel: "",
    rtl: false,
    sidebarIcon: true,
    sidebarSorter: undefined,
    themeColor: true,
    titleIcon: true,
    hostname: "https://mister-hope.github.io",
    headerDepth: 4,
    darkmode: "toggle",
    author: {
        name: "Mr.O",
        // url: "https://mister-hope.com",
    },
    // iconPrefix: [
    //     "icon-",
    //     "fa-",
    // ],
    iconAssets: [
        "//at.alicdn.com/t/c/font_4356167_ohrwv55s8w8.css",
        "fontawesome-with-brands",
    ],
    // iconAssets: "fontawesome-with-brands",
    logo: "/logo.svg",
    repo: "home/git/repos",
    docsDir: "src",
    // navbar
    navbar,
    // sidebar
    sidebar,
    // footer: "默认页脚",
    displayFooter: true,
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
            MrHope: ["https://mister-hope.com", MR_HOPE_AVATAR],
        },
    },
    encrypt: {
        config: {
            "/demo/encrypt.html": ["1234"],
        },
    },
    // page meta
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },
    plugins: {
        blog: true,
        sitemap: true,
        seo: true,
        components: {
            components: [
                "PDF",
            ]
        },
        // install @waline/client before enabling it
        // WARNING: This is a test server for demo only.
        // You should create and use your own comment service in production.
        // comment: {
        //   provider: "Waline",
        //   serverURL: "https://waline-comment.vuejs.press",
        // },
        // all features are enabled for demo, only preserve features you need here
        mdEnhance: {
            component: true,
            footnote: true,
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            demo: true,
            echarts: true,
            figure: true,
            flowchart: true,
            gfm: true,
            imgLazyload: true,
            imgSize: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            playground: {
                presets: ["ts", "vue"],
            },
            revealJs: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({ tag }) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: { type: "tip" },
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
            mathjax: false,
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
        // uncomment these if you want a PWA
        // pwa: {
        //   favicon: "/favicon.ico",
        //   cacheHTML: true,
        //   cachePic: true,
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
}, {
    custom: true
});
