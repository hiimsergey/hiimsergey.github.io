const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")

const lualines = document.getElementsByClassName("lualine")
const modes = document.getElementsByClassName("mode")
const gits = document.getElementsByClassName("git")

const contact = document.getElementById("contact")
const separator = document.getElementById("separator")
const portfolio = document.getElementById("portfolio")
const input = document.getElementById("input")
const aplusplus = document.getElementById("aplusplus")

const separator_mode = document.getElementById("separator-mode")
const separator_git = document.getElementById("separator-git")

const COLORSCHEMES = [
    // catppuccin mocha – https://catppuccin.com/palette
    {
        // TODO FINAL CHECK if all were used
        background: "#1e1e2e",
        bar: "#181825",
        bar_gray: "#313244",
        text: "#cdd6f4",
        subtext: "#a6adc8",
        red: "#f38ba8",
        orange: "#fab387",
        yellow: "#f9e2af",
        green: "#a6e3a1",
        blue: "#89b4fa",
        purple: "#b4befe"
    },

    // gruvbox material – https://github.com/sainnhe/gruvbox-material
    {
        // TODO FINAL CHECK if all were used
        background: "#1d2021",
        bar: "#282828",
        bar_gray: "#3c3836",
        text: "#d4be98",
        subtext: "#7c6f64", // TODO CHECK VALUE
        red: "#ea6962",
        orange: "#e78a4e",
        yellow: "#d8a657",
        green: "#a9b665",
        blue: "#7daea3",
        purple: "#d3869b"
    },

    // rose-pine-moon – https://github.com/rose-pine/nvim
    {
        // TODO FINAL CHECK if all were used
        background: "#232136",
        bar: "#2a283e",
        bar_gray: "#44415a",
        text: "#e0def4",
        subtext: "#6e6a86",
        red: "#eb6f92",
        orange: "#ea9a97",
        yellow: "#f6c177",
        green: "#9ccfd8",
        blue: "#3e8fb0",
        purple: "#c4a7e7"
    }
]

let dragging = false

function set_colorscheme(n) {
    contact.style.backgroundColor = COLORSCHEMES[n].background
    //separator.style.backgroundColor = COLORSCHEMES[n].background
    portfolio.style.backgroundColor = COLORSCHEMES[n].background
    input.style.backgroundColor = COLORSCHEMES[n].background
    document.body.style.color = COLORSCHEMES[n].text

    for (ll of lualines) ll.style.backgroundColor = COLORSCHEMES[n].bar

    for (mode of modes) {
        mode.style.backgroundColor = COLORSCHEMES[n].blue
        mode.style.color = COLORSCHEMES[n].bar

        separator_mode.style.color = COLORSCHEMES[n].blue
        separator_mode.style.backgroundColor = COLORSCHEMES[n].bar_gray
    }

    for (git of gits) {
        git.style.backgroundColor = COLORSCHEMES[n].bar_gray
        git.style.color = COLORSCHEMES[n].blue

        separator_git.style.color = COLORSCHEMES[n].bar_gray
        separator_git.style.backgroundColor = COLORSCHEMES[n].bar
    }

    h2s.forEach(h2 => {
        h2.style.color = COLORSCHEMES[n].orange
    })

    anchors.forEach(a => {
        a.style.color = COLORSCHEMES[n].yellow
    })

    aplusplus.style.color = COLORSCHEMES[n].green
}

separator.addEventListener("mousedown", (e) => {
    dragging = true
    e.preventDefault() // prevent selecting text while dragging
})

document.addEventListener("mousemove", (e) => {
    if (!dragging) return

    const window_w = window.innerWidth
    const contact_w = e.clientX
    const portfolio_w = window_w - contact_w

    contact.style.flexGrow = contact_w
    portfolio.style.flexGrow = portfolio_w
})

document.addEventListener("mouseup", () => {
    dragging = false
})

set_colorscheme(0)
