import { colo, textarea } from "./main.js"

export const COLORSCHEMES = [
    {
        name: "catppuccin-mocha",     // https://catppuccin.com/palette

        background:                   "#1e1e2e", // Base
        bar:                          "#181825", // Mantle
        barSurface:                   "#313244", // Surface 0
        completionBackground:         "#6c7086", // Overlay 0 // TODO
        completionText:               "#a6adc8", // Subtext 0 // TODO
        completionSelectedBackground: "#7f849c", // Overlay 1 // TODO
        completionSelectedText:       "#a6adc8", // Subtext 0 // TODO
        text:                         "#cdd6f4", // Text
        lineNumbers:                  "#585b70", // Surface 2 // TODO
        h1:                           "#f38ba8", // Red
        h2:                           "#fab387", // Peach
        code:                         "#f5c2e7", // Pink
        muted:                        "#585b70", // Surface 2 // TODO
        link:                         "#cdd6f4", // Text
        specialLink:                  "#f9e2af", // Yellow
        normalMode:                   "#89b4fa", // Blue
        wrap:                         "#f2cdcd", // Flamingo
        htmlPreview:                  "#f38ba8", // Red
        error:                        "#f38ba8", // Red
    },

    {
        name: "gruvbox-material",     // https://github.com/sainnhe/gruvbox-material

        background:                   "#282828", // bg0
        bar:                          "#3a3735", // bg_statusline2
        barSurface:                   "#504945", // bg_statusline3
        completionBackground:         "#504945", // bg_statusline3 // TODO
        completionText:               "#d4be98", // fg0
        completionSelectedBackground: "#928374", // grey2 // TODO
        completionSelectedText:       "#504945", // bg_statusline3
        text:                         "#d4be98", // fg0 // TODO
        lineNumbers:                  "#d4be98", // fg0 // TODo
        h1:                           "#ea6962", // red
        h2:                           "#e78a4e", // orange
        code:                         "#a9b665", // green
        muted:                        "#7c6f64", // grey0 // TODO
        link:                         "#7daea3", // blue
        specialLink:                  "#89b482", // aqua // TODO maybe yellow?
        normalMode:                   "#928374", // grey2 // TODO
        wrap:                         "#7daea3", // blue
        htmlPreview:                  "#ea6962", // red
        error:                        "#ea6962", // red
    }
]

export function applyColorscheme() {
    document.documentElement.style.setProperty(
        "--bg-color",
        COLORSCHEMES[colo].background
    )

    document.documentElement.style.setProperty(
        "--bar-color",
        COLORSCHEMES[colo].bar
    )

    document.documentElement.style.setProperty(
        "--bar-surface-color",
        COLORSCHEMES[colo].barSurface
    )

    document.documentElement.style.setProperty(
        "--completion-bg-color",
        COLORSCHEMES[colo].completionBackground
    )

    document.documentElement.style.setProperty(
        "--completion-text-color",
        COLORSCHEMES[colo].completionText
    )

    document.documentElement.style.setProperty(
        "--completion-selected-bg-color",
        COLORSCHEMES[colo].completionSelectedBackground
    )

    document.documentElement.style.setProperty(
        "--completion-selected-text-color",
        COLORSCHEMES[colo].completionSelectedText
    )

    document.documentElement.style.setProperty(
        "--text-color",
        COLORSCHEMES[colo].text
    )

    document.documentElement.style.setProperty(
        "--line-number-color",
        COLORSCHEMES[colo].lineNumbers
    )

    document.documentElement.style.setProperty(
        "--h1-color",
        COLORSCHEMES[colo].h1
    )

    document.documentElement.style.setProperty(
        "--h2-color",
        COLORSCHEMES[colo].h2
    )

    document.documentElement.style.setProperty(
        "--code-color",
        COLORSCHEMES[colo].code
    )

    document.documentElement.style.setProperty(
        "--muted-color",
        COLORSCHEMES[colo].muted
    )

    document.documentElement.style.setProperty(
        "--link-color",
        COLORSCHEMES[colo].link
    )

    document.documentElement.style.setProperty(
        "--special-link-color",
        COLORSCHEMES[colo].specialLink
    )

    document.documentElement.style.setProperty(
        "--normal-mode-color",
        COLORSCHEMES[colo].normalMode
    )

    document.documentElement.style.setProperty(
        "--wrap-color",
        COLORSCHEMES[colo].wrap
    )

    document.documentElement.style.setProperty(
        "--html-preview-color",
        COLORSCHEMES[colo].htmlPreview
    )

    document.documentElement.style.setProperty(
        "--error-color",
        COLORSCHEMES[colo].error
    )

    textarea.style.color = COLORSCHEMES[colo].text
}
