import "vuepress-theme-hope/presets/bounce-icon.scss"
import "vuepress-theme-hope/presets/shinning-feature-panel.scss"
import { defineClientConfig } from "vuepress/client";
import { setupSnowFall } from "vuepress-theme-hope/presets/snowFall.js";

export default defineClientConfig({
    setup() {
        setupSnowFall();
    },
});
