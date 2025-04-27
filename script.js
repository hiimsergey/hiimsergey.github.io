import { COLORSCHEMES } from "./colorschemes.js"
import { COMMANDS } from "./commands.js"

// Elements and pseudo-elements
export const input = document.querySelector("input")
const h1s = document.querySelectorAll("h1")
const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")
const deemphs = document.getElementsByClassName("deemph")

// Root structure
const contact = document.getElementById("contact")
const handle = document.getElementById("handle")
const handle_line = document.getElementById("handle-line")
const portfolio = document.getElementById("portfolio")
const aplusplus = document.getElementById("aplusplus")

// Lualine - bunches
const lualines = document.getElementsByClassName("lualine")
const modes = document.getElementsByClassName("mode")
const gits = document.getElementsByClassName("git")

// Lualine - singles
const contact_filename = contact.querySelector(".filename")
const contact_position = contact.querySelector(".position")
const portfolio_filename = portfolio.querySelector(".filename")

const platform = portfolio.querySelector("#platform")
const encoding = portfolio.querySelector("#encoding")
const filetype = portfolio.querySelector("#filetype")
const percentage = portfolio.querySelector("#percentage")
const position = portfolio.querySelector(".position")
const wrap = portfolio.querySelector(".wrap")

// Lualine - separators
const boring_separators = portfolio.querySelectorAll(".boring-separator")
const separator_mode = portfolio.querySelector("#separator-mode")
const separator_git = portfolio.querySelector("#separator-git")
const separator_percentage = portfolio.querySelector("#separator-percentage")
const separator_position = portfolio.querySelector("#separator-position")
const separator_wrap = portfolio.querySelector("#separator-wrap")

const CONTACT_LINES = 15
const PORTFOLIO_LINES = 31

export let ctx = {
    colo: Math.floor(Math.random() * COLORSCHEMES.length),
    dragging: false,

    apply_colorscheme: function() {
        document.body.style.color = COLORSCHEMES[ctx.colo].text
        document.documentElement.style.setProperty("--ln-color", COLORSCHEMES[ctx.colo].muted)

        contact.style.backgroundColor = COLORSCHEMES[ctx.colo].background
        handle.style.backgroundColor = COLORSCHEMES[ctx.colo].background
        handle_line.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
        portfolio.style.backgroundColor = COLORSCHEMES[ctx.colo].background

        input.style.color = COLORSCHEMES[ctx.colo].text
        input.style.backgroundColor = COLORSCHEMES[ctx.colo].background

        for (const ll of lualines) ll.style.backgroundColor = COLORSCHEMES[ctx.colo].bar

        // TODO NOW REMOVE loop
        for (const mode of modes) {
            mode.style.backgroundColor = COLORSCHEMES[ctx.colo].mode_normal
            mode.style.color = COLORSCHEMES[ctx.colo].bar

            separator_mode.style.color = COLORSCHEMES[ctx.colo].mode_normal
            separator_mode.style.backgroundColor = COLORSCHEMES[ctx.colo].bar_gray
        }

        // TODO NOW REMOVE loop
        for (const git of gits) {
            git.style.backgroundColor = COLORSCHEMES[ctx.colo].bar_gray
            git.style.color = COLORSCHEMES[ctx.colo].mode_normal

            separator_git.style.color = COLORSCHEMES[ctx.colo].bar_gray
            separator_git.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
        }

        for (const bs of boring_separators) bs.style.backgroundColor = COLORSCHEMES[ctx.colo].bar

        encoding.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
        platform.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
        filetype.style.backgroundColor = COLORSCHEMES[ctx.colo].bar

        separator_percentage.style.color = COLORSCHEMES[ctx.colo].bar_gray
        separator_percentage.style.backgroundColor = COLORSCHEMES[ctx.colo].bar

        percentage.style.color = COLORSCHEMES[ctx.colo].mode_normal
        percentage.style.backgroundColor = COLORSCHEMES[ctx.colo].bar_gray

        separator_position.style.color = COLORSCHEMES[ctx.colo].mode_normal
        separator_position.style.backgroundColor = COLORSCHEMES[ctx.colo].bar_gray

        position.style.color = COLORSCHEMES[ctx.colo].background
        position.style.backgroundColor = COLORSCHEMES[ctx.colo].mode_normal

        separator_wrap.style.color = COLORSCHEMES[ctx.colo].wrap
        separator_wrap.style.backgroundColor = COLORSCHEMES[ctx.colo].mode_normal

        wrap.style.color = COLORSCHEMES[ctx.colo].background
        wrap.style.backgroundColor = COLORSCHEMES[ctx.colo].wrap

        h1s.forEach(h1 => h1.style.color = COLORSCHEMES[ctx.colo].h1)
        h2s.forEach(h2 => h2.style.color = COLORSCHEMES[ctx.colo].h2)
        anchors.forEach(a => a.style.color = COLORSCHEMES[ctx.colo].link)
        for (const de of deemphs) de.style.color = COLORSCHEMES[ctx.colo].muted

        aplusplus.style.color = COLORSCHEMES[ctx.colo].link_special

        contact_filename.style.color = COLORSCHEMES[ctx.colo].muted
        contact_position.style.color = COLORSCHEMES[ctx.colo].muted

        portfolio_filename.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
    },

    process_command: function(command) {
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

        const args = command.trim().split(" ")

        for (const CMDOBJ of COMMANDS) {
            if (args[0] === CMDOBJ.cmd) {
                CMDOBJ.callback(args)
                return
            }
        }

        input.style.color = COLORSCHEMES[ctx.colo].h1
        input.style.fontStyle = "italic"
        input.value = `E492: Not an editor command: ${command}`
    },

    // TODO NOTE it should also trigger on commands like :colo and :help
    trigger_completions: function(command) {
        console.log("triggering completions")
    }
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case ":":
            input.style.color = COLORSCHEMES[ctx.colo].text
            input.style.fontStyle = "normal"
            input.value = ":"
            input.focus()
            e.preventDefault() // Don't type ":" again
            break
        case "i":
            if (document.activeElement.tagName === "INPUT") break
            input.style.color = COLORSCHEMES[ctx.colo].h1
            input.style.fontStyle = "italic"
            input.value = "E21: Cannot make changes, 'modifiable' is off"
    }
})

input.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Enter":
            ctx.process_command(input.value.slice(1))
            input.blur()
            break
        case "Tab":
            ctx.trigger_completions(input.value.slice(1))
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
    ctx.dragging = true
    e.preventDefault() // Prevent selecting text while dragging
})

document.addEventListener("mousemove", (e) => {
    if (!ctx.dragging) return

    const window_w = window.innerWidth
    const contact_w = e.clientX
    const portfolio_w = window_w - contact_w

    contact.style.width = contact_w + "px"
    portfolio.style.width = portfolio_w + "px"
})

document.addEventListener("mouseup", () => {
    ctx.dragging = false
})

ctx.apply_colorscheme()
