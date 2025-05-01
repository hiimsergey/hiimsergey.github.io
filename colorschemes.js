// TODO make hexcolor description v3
// own color for line numbers and lualine components
export const COLORSCHEMES = [
    {
        name: "catppuccin-mocha", // https://catppuccin.com/palette

        background:               "#1e1e2e",  // Base
        bar:                      "#181825",  // Mantle
        bar_gray:                 "#313244",  // Surface 0
        completion_text:          "#bac2de",  // Subtext 1
        completion_selected:      "#45475a",  // Surface 1
        completion_selected_text: "#cdd6f4",  // Text
        text:                     "#cdd6f4",  // Text
        muted:                    "#45475a",  // Surface 1
        h1:                       "#f38ba8",  // Red
        h2:                       "#fab387",  // Peach
        link:                     "#f9e2af",  // Yellow
        link_special:             "#a6e3a1",  // Green
        mode_normal:              "#89b4fa",  // Blue
        wrap:                     "#eba0ac"   // Mauve
    },

    {
        name: "henna",            // https://github.com/httpsterio/vscode-henna

        background:               "#21272e",  // bg
        bar:                      "#10151a",  // base0
        bar_gray:                 "#282c34",  // base4
        completion_text:          "#6b717d",  // fg-alt
        completion_selected:      "#495162",  // base7
        completion_selected_text: "#f8f8f0",  // fg
        text:                     "#f8f8f0",  // fg
        muted:                    "#6b717d",  // fg-alt
        h1:                       "#e74c3c",  // red
        h2:                       "#53df83",  // green
        link:                     "#53df83",  // green
        link_special:             "#1abc9c",  // teal
        mode_normal:              "#56b5c2",  // blue
        wrap:                     "#1abc9c"   // teal
    },

    {
        name: "gruvbox-material", // https://github.com/sainnhe/gruvbox-material

        background:               "#282828",  // bg0
        bar:                      "#3a3735",  // bg_statusline2
        bar_gray:                 "#504945",  // bg_statusline3
        completion_text:          "#d4be98",  // fg0
        completion_selected:      "#928374",  // grey2
        completion_selected_text: "#504945",  // bg_statusline3
        text:                     "#d4be98",  // fg0
        muted:                    "#7c6f64",  // grey0
        h1:                       "#ea6962",  // red
        h2:                       "#e78a4e",  // orange
        link:                     "#89b482",  // aqua
        link_special:             "#d3869b",  // purple
        mode_normal:              "#7daea3",  // blue
        wrap:                     "#a9b665"   // green
    },

    {
        name: "helix", // https://github.com/helix-editor/helix/blob/master/theme.toml

        background:               "#3b224c",  // midnight
        bar:                      "#281733",  // revolver
        bar_gray:                 "#281733",  // revolver
        completion_text:          "#a4a0e8",  // lavender
        completion_selected:      "#ffffff",  // white
        completion_selected_text: "#000000",  // ???
        text:                     "#a4a0e8",  // lavender
        muted:                    "#5a5977",  // comet
        h1:                       "#dbbfef",  // lilac
        h2:                       "#dbbfef",  // lilac
        link:                     "#efba5d",  // honey
        link_special:             "#9ff28f",  // mint
        mode_normal:              "#281733",  // revolver
        wrap:                     "#281733"   // revolver
    },
    // TODO NOTE
    // line number selected #dbbfef // lilac
    // completion background #452859 // bossanova

    {
        name: "rose-pine-moon",   // https://rosepinetheme.com/palette/ingredients

        background:               "#232136",  // Base
        bar:                      "#2a283e",  // Highlight Low
        bar_gray:                 "#44415a",  // Highlight Med
        completion_text:          "#908caa",  // Subtle
        completion_selected:      "#56526e",  // Highlight High
        completion_selected_text: "#e0def4",  // Text
        text:                     "#e0def4",  // Text
        muted:                    "#6e6a86",  // Muted
        h1:                       "#eb6f92",  // Love
        h2:                       "#f6c177",  // Gold
        link:                     "#ea9a97",  // Rose
        link_special:             "#9ccfd8",  // Foam
        mode_normal:              "#3e8fb0",  // Pine
        wrap:                     "#c4a7e7"   // Iris
    }
]
