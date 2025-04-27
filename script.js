const h1s = document.querySelectorAll("h1")
const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")
const input = document.querySelector("input")
const deemphs = document.getElementsByClassName("deemph")

const lualines = document.getElementsByClassName("lualine")
const modes = document.getElementsByClassName("mode")
const gits = document.getElementsByClassName("git")

const contact = document.getElementById("contact")
const handle = document.getElementById("handle")
const handle_line = document.getElementById("handle-line")
const portfolio = document.getElementById("portfolio")
const aplusplus = document.getElementById("aplusplus")

const contact_filename = contact.querySelector(".filename")
const contact_position = contact.querySelector(".position")

const platform = portfolio.querySelector("#platform")
const encoding = portfolio.querySelector("#encoding")
const filetype = portfolio.querySelector("#filetype")
const percentage = portfolio.querySelector("#percentage")
const position = portfolio.querySelector(".position")
const wrap = portfolio.querySelector(".wrap")

const boring_separators = portfolio.querySelectorAll(".boring-separator")
const separator_mode = portfolio.querySelector("#separator-mode")
const separator_git = portfolio.querySelector("#separator-git")
const separator_percentage = portfolio.querySelector("#separator-percentage")
const separator_position = portfolio.querySelector("#separator-position")
const separator_wrap = portfolio.querySelector("#separator-wrap")

const portfolio_filename = portfolio.querySelector(".filename")

const CONTACT_LINES = 15
const PORTFOLIO_LINES = 31

// TODO USE
const COMMANDS = [
    "q"
    // colorscheme
    // h
    // _ E21
    // _ every other command
    // hide
    // vs #
]

// TODO FINAL ADD comments about what the name of each hexcolor is
const COLORSCHEMES = [
    {
        name: "catppuccin-mocha",  // https://catppuccin.com/palette

        background:    "#1e1e2e",  // Base
        bar:           "#181825",  // Mantle
        bar_gray:      "#313244",  // Surface 0
        text:          "#cdd6f4",  // Text
        muted:       "#45475a",  // Surface 1
        h1:            "#f38ba8",  // Red
        h2:            "#fab387",  // Peach
        link:          "#f9e2af",  // Yellow
        link_special:  "#a6e3a1",  // Green
        mode_normal:   "#89b4fa",  // Blue
        wrap:          "#eba0ac"   // Mauve
    },

    {
        name: "gruvbox-material",  // https://github.com/sainnhe/gruvbox-material

        background:    "#282828",  // bg0
        bar:           "#3a3735",  // bg_statusline2
        bar_gray:      "#504945",  // bg_statusline3
        text:          "#d4be98",  // fg0
        muted:       "#7c6f64",  // grey0
        h1:            "#ea6962",  // red
        h2:            "#e78a4e",  // orange
        link:          "#89b482",  // aqua
        link_special:  "#d3869b",  // purple
        mode_normal:   "#7daea3",  // blue
        wrap:          "#a9b665"   // green
    },

    {
        name: "rose-pine-moon",    // https://rosepinetheme.com/palette/ingredients

        background:    "#232136",  // Base
        bar:           "#2a283e",  // Highlight Low
        bar_gray:      "#44415a",  // Highlight Med
        text:          "#e0def4",  // Text
        muted:       "#6e6a86",  // Muted
        h1:            "#eb6f92",  // Love
        h2:            "#f6c177",  // Gold
        link:          "#ea9a97",  // Rose
        link_special:  "#9ccfd8",  // Foam
        mode_normal:   "#3e8fb0",  // Pine
        wrap:          "#c4a7e7"   // Iris
    }
]

let colo = Math.floor(Math.random() * COLORSCHEMES.length)
let dragging = false

function set_colorscheme() {
    document.body.style.color = COLORSCHEMES[colo].text
    document.documentElement.style.setProperty("--ln-color", COLORSCHEMES[colo].muted)

    contact.style.backgroundColor = COLORSCHEMES[colo].background
    handle.style.backgroundColor = COLORSCHEMES[colo].background
    handle_line.style.backgroundColor = COLORSCHEMES[colo].bar
    portfolio.style.backgroundColor = COLORSCHEMES[colo].background

    input.style.color = COLORSCHEMES[colo].text
    input.style.backgroundColor = COLORSCHEMES[colo].background

    for (ll of lualines) ll.style.backgroundColor = COLORSCHEMES[colo].bar

    // TODO NOW REMOVE loop
    for (mode of modes) {
        mode.style.backgroundColor = COLORSCHEMES[colo].mode_normal
        mode.style.color = COLORSCHEMES[colo].bar

        separator_mode.style.color = COLORSCHEMES[colo].mode_normal
        separator_mode.style.backgroundColor = COLORSCHEMES[colo].bar_gray
    }

    // TODO NOW REMOVE loop
    for (git of gits) {
        git.style.backgroundColor = COLORSCHEMES[colo].bar_gray
        git.style.color = COLORSCHEMES[colo].mode_normal

        separator_git.style.color = COLORSCHEMES[colo].bar_gray
        separator_git.style.backgroundColor = COLORSCHEMES[colo].bar
    }

    for (bs of boring_separators) bs.style.backgroundColor = COLORSCHEMES[colo].bar

    encoding.style.backgroundColor = COLORSCHEMES[colo].bar
    platform.style.backgroundColor = COLORSCHEMES[colo].bar
    filetype.style.backgroundColor = COLORSCHEMES[colo].bar

    separator_percentage.style.color = COLORSCHEMES[colo].bar_gray
    separator_percentage.style.backgroundColor = COLORSCHEMES[colo].bar

    percentage.style.color = COLORSCHEMES[colo].mode_normal
    percentage.style.backgroundColor = COLORSCHEMES[colo].bar_gray

    separator_position.style.color = COLORSCHEMES[colo].mode_normal
    separator_position.style.backgroundColor = COLORSCHEMES[colo].bar_gray

    position.style.color = COLORSCHEMES[colo].background
    position.style.backgroundColor = COLORSCHEMES[colo].mode_normal

    separator_wrap.style.color = COLORSCHEMES[colo].wrap
    separator_wrap.style.backgroundColor = COLORSCHEMES[colo].mode_normal

    wrap.style.color = COLORSCHEMES[colo].background
    wrap.style.backgroundColor = COLORSCHEMES[colo].wrap

    h1s.forEach(h1 => h1.style.color = COLORSCHEMES[colo].h1)
    h2s.forEach(h2 => h2.style.color = COLORSCHEMES[colo].h2)
    anchors.forEach(a => a.style.color = COLORSCHEMES[colo].link)
    for (de of deemphs) de.style.color = COLORSCHEMES[colo].muted

    aplusplus.style.color = COLORSCHEMES[colo].link_special

    contact_filename.style.color = COLORSCHEMES[colo].muted
    contact_position.style.color = COLORSCHEMES[colo].muted

    portfolio_filename.style.backgroundColor = COLORSCHEMES[colo].bar
}

function process_command(command) {
    console.log("TODO processing: '", command, "'")

    if (command[0] === "!") {
        const shell_command = command.slice(1)
        const tildes = "~".repeat(shell_command.replace(/ .*/, "").length - 2)
        const msg = `:!${shell_command}
sh: Unknown command: ${shell_command}
sh:
${shell_command}
^${tildes}^

shell returned 127

Press ENTER or type command to continue`

        // TODO
        console.clear()
        console.log(msg)
    }

    if (command === "q" || command === "q!") {
        window.open(window.location, "_self").close()
    }
}

function trigger_completions(command) {
    console.log("triggering completions")
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case ":":
            input.style.color = COLORSCHEMES[colo].text
            input.style.fontStyle = "normal"
            input.value = ":"
            input.focus()
            e.preventDefault() // Don't type ":" again
            break
        case "i":
            if (document.activeElement.tagName === "INPUT") break
            input.style.color = COLORSCHEMES[colo].red
            input.style.fontStyle = "italic"
            input.value = "E21: Cannot make changes, 'modifiable' is off"
    }
})

input.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Enter":
            process_command(input.value.slice(1))
            input.blur()
            break
        case "Tab":
            trigger_completions(input.value.slice(1))
            e.preventDefault()
            break
        case "Backspace":
            if (input.value !== ":") break
        case "Escape":
            input.value = ""
            input.blur()
            break
    }
})

handle.addEventListener("mousedown", (e) => {
    dragging = true
    e.preventDefault() // Prevent selecting text while dragging
})

document.addEventListener("mousemove", (e) => {
    if (!dragging) return

    const window_w = window.innerWidth
    const contact_w = e.clientX
    const portfolio_w = window_w - contact_w

    contact.style.width = contact_w + "px"
    portfolio.style.width = portfolio_w + "px"
})

document.addEventListener("mouseup", () => {
    dragging = false
})

set_colorscheme()
