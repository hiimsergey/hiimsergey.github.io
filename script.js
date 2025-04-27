const h1s = document.querySelectorAll("h1")
const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")
const input = document.querySelector("input")

const line_numbers = document.getElementsByClassName("line-numbers")
const lualines = document.getElementsByClassName("lualine")
const modes = document.getElementsByClassName("mode")
const gits = document.getElementsByClassName("git")

const contact = document.getElementById("contact")
const handle = document.getElementById("handle")
const handle_line = document.getElementById("handle-line")
const portfolio = document.getElementById("portfolio")
const aplusplus = document.getElementById("aplusplus")

const contact_line_numbers = contact.querySelector(".line-numbers")
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

const portfolio_line_numbers = portfolio.querySelector(".line-numbers")
const portfolio_filename = portfolio.querySelector(".filename")

const CONTACT_LINES = 15
const PORTFOLIO_LINES = 32

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
    // catppuccin mocha – https://catppuccin.com/palette
    {
        // TODO FINAL CHECK if all were used
        background: "#1e1e2e",
        bar: "#181825",
        bar_gray: "#313244",
        text: "#cdd6f4",
        subtext: "#45475a", // Surface 1
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

let colo = 0
let dragging = false

function set_colorscheme() {
    document.body.style.color = COLORSCHEMES[colo].text

    contact.style.backgroundColor = COLORSCHEMES[colo].background
    handle.style.backgroundColor = COLORSCHEMES[colo].background
    handle_line.style.backgroundColor = COLORSCHEMES[colo].bar
    portfolio.style.backgroundColor = COLORSCHEMES[colo].background

    input.style.color = COLORSCHEMES[colo].text
    input.style.backgroundColor = COLORSCHEMES[colo].background

    for (ln of line_numbers) {
        ln.style.color = COLORSCHEMES[colo].subtext
        ln.style.backgroundColor = COLORSCHEMES[colo].background
    }

    for (ll of lualines) ll.style.backgroundColor = COLORSCHEMES[colo].bar

    // TODO NOW REMOVE loop
    for (mode of modes) {
        mode.style.backgroundColor = COLORSCHEMES[colo].blue
        mode.style.color = COLORSCHEMES[colo].bar

        separator_mode.style.color = COLORSCHEMES[colo].blue
        separator_mode.style.backgroundColor = COLORSCHEMES[colo].bar_gray
    }

    // TODO NOW REMOVE loop
    for (git of gits) {
        git.style.backgroundColor = COLORSCHEMES[colo].bar_gray
        git.style.color = COLORSCHEMES[colo].blue

        separator_git.style.color = COLORSCHEMES[colo].bar_gray
        separator_git.style.backgroundColor = COLORSCHEMES[colo].bar
    }

    for (bs of boring_separators) bs.style.backgroundColor = COLORSCHEMES[colo].bar

    encoding.style.backgroundColor = COLORSCHEMES[colo].bar
    platform.style.backgroundColor = COLORSCHEMES[colo].bar
    filetype.style.backgroundColor = COLORSCHEMES[colo].bar

    separator_percentage.style.color = COLORSCHEMES[colo].bar_gray
    separator_percentage.style.backgroundColor = COLORSCHEMES[colo].bar

    percentage.style.color = COLORSCHEMES[colo].blue
    percentage.style.backgroundColor = COLORSCHEMES[colo].bar_gray

    separator_position.style.color = COLORSCHEMES[colo].blue
    separator_position.style.backgroundColor = COLORSCHEMES[colo].bar_gray

    position.style.color = COLORSCHEMES[colo].background
    position.style.backgroundColor = COLORSCHEMES[colo].blue

    separator_wrap.style.color = COLORSCHEMES[colo].red
    separator_wrap.style.backgroundColor = COLORSCHEMES[colo].blue

    wrap.style.color = COLORSCHEMES[colo].background
    wrap.style.backgroundColor = COLORSCHEMES[colo].red

    h1s.forEach(h1 => h1.style.color = COLORSCHEMES[colo].red)
    h2s.forEach(h2 => h2.style.color = COLORSCHEMES[colo].orange)
    anchors.forEach(a => a.style.color = COLORSCHEMES[colo].yellow)

    aplusplus.style.color = COLORSCHEMES[colo].green

    contact_filename.style.color = COLORSCHEMES[colo].subtext
    contact_position.style.color = COLORSCHEMES[colo].subtext

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

function create_contact_line_numbers() {
    for (let i = 1; i <= CONTACT_LINES; ++i) {
        const line = document.createElement("div")
        line.innerHTML = i
        contact_line_numbers.appendChild(line)
    }
    contact_line_numbers.children[1].style.height = "27.3em";
}

function create_portfolio_line_numbers() {
    for (let i = 1; i <= PORTFOLIO_LINES; ++i) {
        const line = document.createElement("div")
        line.innerHTML = i
        portfolio_line_numbers.appendChild(line)
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

create_contact_line_numbers()
create_portfolio_line_numbers()
set_colorscheme()
