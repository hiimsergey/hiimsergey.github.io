const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")
const input = document.querySelector("input")

const lualines = document.getElementsByClassName("lualine")
const modes = document.getElementsByClassName("mode")
const gits = document.getElementsByClassName("git")

const contact = document.getElementById("contact")
const separator = document.getElementById("separator")
const portfolio = document.getElementById("portfolio")
const aplusplus = document.getElementById("aplusplus")

const contact_filename = contact.querySelector(".filename")
const contact_position = contact.querySelector(".position")

const percentage = portfolio.querySelector("#percentage")
const position = portfolio.querySelector(".position")

const boring_separators = portfolio.querySelectorAll(".boring-separator")
const separator_mode = portfolio.querySelector("#separator-mode")
const separator_git = portfolio.querySelector("#separator-git")
const separator_percentage = portfolio.querySelector("#separator-percentage")
const separator_position = portfolio.querySelector("#separator-position")

// TODO USE
const COMMANDS = [
    "q"
]

// TODO FINAL ADD comments about what the name of each hexcolor is
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
    },

    // github – https://primer.style/product/primitives/color
    {
        // TODO FINAL CHECK if all were used
        background: "#e6eaef",
        bar: "#2a283e",
        bar_gray: "#44415a",
        text: "#e0def4",
        subtext: "#6e6a86",
        red: "#eb6f92",
        orange: "#ea9a97",
        yellow: "#0969da",
        green: "#9ccfd8",
        blue: "#0969da",
        purple: "#c4a7e7"
    }
]

let dragging = false

function set_colorscheme(n) {
    contact.style.backgroundColor = COLORSCHEMES[n].background
    //separator.style.backgroundColor = COLORSCHEMES[n].background
    portfolio.style.backgroundColor = COLORSCHEMES[n].background
    input.style.color = COLORSCHEMES[n].text
    input.style.backgroundColor = COLORSCHEMES[n].background
    document.body.style.color = COLORSCHEMES[n].text

    for (ll of lualines) ll.style.backgroundColor = COLORSCHEMES[n].bar

    // TODO NOW REMOVE loop
    for (mode of modes) {
        mode.style.backgroundColor = COLORSCHEMES[n].blue
        mode.style.color = COLORSCHEMES[n].bar

        separator_mode.style.color = COLORSCHEMES[n].blue
        separator_mode.style.backgroundColor = COLORSCHEMES[n].bar_gray
    }

    // TODO NOW REMOVE loop
    for (git of gits) {
        git.style.backgroundColor = COLORSCHEMES[n].bar_gray
        git.style.color = COLORSCHEMES[n].blue

        separator_git.style.color = COLORSCHEMES[n].bar_gray
        separator_git.style.backgroundColor = COLORSCHEMES[n].bar
    }

    for (bs of boring_separators) bs.style.backgroundColor = COLORSCHEMES[n].bar

    separator_percentage.style.color = COLORSCHEMES[n].bar_gray
    separator_percentage.style.backgroundColor = COLORSCHEMES[n].bar

    percentage.style.color = COLORSCHEMES[n].blue
    percentage.style.backgroundColor = COLORSCHEMES[n].bar_gray

    separator_position.style.color = COLORSCHEMES[n].blue
    separator_position.style.backgroundColor = COLORSCHEMES[n].bar_gray

    position.style.color = COLORSCHEMES[n].background
    position.style.backgroundColor = COLORSCHEMES[n].blue

    h2s.forEach(h2 => h2.style.color = COLORSCHEMES[n].orange)
    anchors.forEach(a => a.style.color = COLORSCHEMES[n].yellow)

    aplusplus.style.color = COLORSCHEMES[n].green

    contact_filename.style.color = COLORSCHEMES[n].subtext
    contact_position.style.color = COLORSCHEMES[n].subtext
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
    if (e.key === ":") {
        input.value = ":"
        input.focus()
        e.preventDefault() // Don't type ":" again
    }
})

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        process_command(input.value.slice(1))
        input.blur()
    }
    if (e.key === "Tab") {
        trigger_completions(input.value.slice(1))
        e.preventDefault()
    }
    if (e.key === "Escape" || (input.value === ":" && e.key === "Backspace")) {
        input.value = ""
        input.blur()
    }
})

separator.addEventListener("mousedown", (e) => {
    dragging = true
    e.preventDefault() // Prevent selecting text while dragging
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
