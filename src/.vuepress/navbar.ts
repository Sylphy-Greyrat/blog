import {navbar} from "vuepress-theme-hope";

export default navbar([
    {
        text: "主页",
        icon: "fas fa-home",
        link: "/"
    },
    {
        text: "文章",
        icon: "fas fa-pen-to-square",
        prefix: "/",
        children: [
            {
                text: "代码开发",
                icon: "fas fa-code",
                link: "posts/"
            },
            {
                text: "Linux",
                icon: "iconfont icon-linux",
                link: "Linux/"
            }
        ],
    },
    {
        text: "V2 文档",
        icon: "fas fa-book",
        link: "https://theme-hope.vuejs.press/zh/",
    },
]);
