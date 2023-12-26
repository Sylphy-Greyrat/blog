import { sidebar } from "vuepress-theme-hope";
export default sidebar({
    "/": [
        // "",
        // {
        //     text: "如何使用",
        //     icon: "fas fa-laptop-code",
        //     prefix: "demo/",
        //     link: "demo/",
        //     children: "structure",
        // },
        {
            text: "文章",
            icon: "fas fa-book",
            prefix: "posts/",
            children: "structure",
        },
        // "intro",
        // // "slides",
    ],
    "/posts/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/",
            prefix: "代码开发"
        },
        {
            text: "规范",
            icon: "iconfont icon-repo1",
            children: [
                "代码规范"
            ],
        }
    ],
    "/posts/Ajax/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "Ajax",
            icon: "iconfont icon-ajax",
            children: "structure"
        }
    ],
    "/posts/javaWeb/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "javaWeb",
            icon: "iconfont icon-Group",
            link: "/posts/javaWeb/",
            children: "structure",
        }
    ],
    "/posts/jeecg/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "Jeecg",
            icon: "fas fa-laptop-code",
            link: "/posts/jeecg/",
            children: "structure",
        }
    ],
    "/posts/SpringBoot/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "Spring Boot",
            icon: "iconfont icon-bxl-spring-boot",
            link: "/posts/SpringBoot/",
            children: "structure",
        }
    ],
    "/posts/vue/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "Vue",
            icon: "iconfont icon-vuejs",
            link: "/posts/vue/",
            children: "structure",
        }
    ],
    "/posts/前端学习路线/": [
        {
            text: "代码开发",
            icon: "fas fa-code",
            link: "/posts/"
        },
        {
            text: "前端学习路线",
            icon: "iconfont icon-qianduankaifa",
            link: "/posts/前端学习路线/",
            children: "structure",
        }
    ],
    "/Linux/": [
        {
            text: "Linux",
            icon: "iconfont icon-linux",
            link: "/Linux/"
        },
        "/Linux/Git/git.md"
    ],
    "/Linux/Git/": [
        {
            text: "Linux",
            icon: "iconfont icon-linux",
            link: "/Linux/"
        },
        {
            text: "Git",
            icon: "iconfont icon-git",
            link: "/Linux/Git/",
            children: "structure",
            // activeMatch: "^/Linux"
        }
    ]
});
