import { COLORSCHEMES } from "./colorschemes.js"
import { COMMANDS } from "./commands.js"
import { construct_completions, reset_completions } from "./completion.js"
import { init_command_history, reset_command_history } from "./history.js"

// Elements and pseudo-elements
export const input = document.querySelector("input")
const h1s = document.querySelectorAll("h1")
const h2s = document.querySelectorAll("h2")
const anchors = document.querySelectorAll("a")
const deemphs = document.getElementsByClassName("deemph")

// Root structure
export const completion = document.getElementById("completion")
const contact = document.getElementById("contact")
const handle = document.getElementById("handle")
const handle_line = document.getElementById("handle-line")
const portfolio = document.getElementById("portfolio")
const aplusplus = document.getElementById("aplusplus")

// Classes
export const contents = document.getElementsByClassName("content")

// Lualine - bunches
// TODO CONSIDER change to querySelector to use .forEach if not using CSS variables
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

// Measures the width of `1ch` from CSS in pixels precisely.
// Useful for discrete pane resizing.
function measureCh(el = document.body) {
    const span = document.createElement("span")
    span.innerText = "0"
    span.style.position = "absolute"
    span.style.visibility = "hidden"
    span.style.font = getComputedStyle(el).font

    document.body.appendChild(span)
    const width = span.getBoundingClientRect().width
    document.body.removeChild(span)

    return width
}
const ch = measureCh()

export let ctx = {
    colo: Math.floor(Math.random() * COLORSCHEMES.length),
    dragging: false,
    completion: {
        input: "",
        trigger: construct_completions,
        options: [],
        cur: 0
    },
    // TODO NOTE when escaping history while having an old command open, it gets moved to the end, not copied
    history: {
        commands: {
            trigger: init_command_history,
            history: [],
            cur: -1
        }
    },

    apply_colorscheme: function() {
        document.body.style.color = COLORSCHEMES[ctx.colo].text
        document.documentElement.style.setProperty(
            "--color-line-numbers",
            COLORSCHEMES[ctx.colo].muted
        )

        contact.style.backgroundColor = COLORSCHEMES[ctx.colo].background
        handle.style.backgroundColor = COLORSCHEMES[ctx.colo].background
        handle_line.style.backgroundColor = COLORSCHEMES[ctx.colo].bar
        portfolio.style.backgroundColor = COLORSCHEMES[ctx.colo].background

        input.style.color = COLORSCHEMES[ctx.colo].text
        input.style.backgroundColor = COLORSCHEMES[ctx.colo].background

        completion.style.color = COLORSCHEMES[ctx.colo].completion_text
        completion.style.backgroundColor = COLORSCHEMES[ctx.colo].bar_gray

        document.documentElement.style.setProperty(
            "--color-completion-selected",
            COLORSCHEMES[ctx.colo].completion_selected
        )
        document.documentElement.style.setProperty(
            "--color-completion-selected-text",
            COLORSCHEMES[ctx.colo].completion_selected_text
        )

        for (const ll of lualines) ll.style.backgroundColor = COLORSCHEMES[ctx.colo].bar

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

    execute_command: function() {
        const command = input.value.replace(/^:+/, "")

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

        for (const CMD of COMMANDS) {
            if (args[0] === CMD.name) {
                CMD.callback(args)
                return
            }
        }

        // TODO CONSIDER replacing h1 with a new color .red
        input.style.color = COLORSCHEMES[ctx.colo].h1
        input.style.fontStyle = "italic"
        input.value = `E492: Not an editor command: ${command}`
    },
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case ":":
            if (document.activeElement === input) break
            input.style.color = COLORSCHEMES[ctx.colo].text
            input.style.fontStyle = "normal"
            input.value = ":"
            input.focus()
            e.preventDefault() // Don't type ":" again
            break
        case "i":
            if (document.activeElement === input) break
            input.style.color = COLORSCHEMES[ctx.colo].h1
            input.style.fontStyle = "italic"
            input.value = "E21: Cannot make changes, 'modifiable' is off"
            break
    }
})

input.addEventListener("keydown", (e) => {
    // TODO OPTIMIZE
    switch (e.key) {
        case "Enter":
            reset_completions()
            reset_command_history()
            ctx.execute_command()
            input.blur()
            break
        case "Tab":
            ctx.completion.trigger()
            e.preventDefault()
            break
        case "ArrowUp":
            ctx.history.commands.trigger(true)
            e.preventDefault()
            break
        case "ArrowDown":
            ctx.history.commands.trigger(false)
            e.preventDefault()
            break

        case "Backspace":
            if (input.value !== ":") break
        case "Escape":
            // TODO
            reset_command_history()
            input.value = ""
            input.blur()
        default:
            reset_completions()
            if (ctx.history.commands.trigger !== init_command_history) {
                ctx.history.commands.trigger = init_command_history
                ctx.history.commands.history.pop()
            }
            break
    }
})

handle.addEventListener("mousedown", (e) => {
    ctx.dragging = true
    e.preventDefault() // Prevent selecting text while dragging
})

document.addEventListener("mousemove", (e) => {
    // TODO
    //if (!ctx.dragging) return

    //const window_w = window.innerWidth
    //const contact_w = e.clientX
    //const portfolio_w = window_w - contact_w

    //contact.style.width = contact_w + "px"
    //portfolio.style.width = portfolio_w + "px"

    if (!ctx.dragging) return

    const window_w = window.innerWidth

    const contact_w_raw = e.clientX
    const contact_w_snapped = Math.round(contact_w_raw / ch) * ch
    const contact_w = Math.min(Math.max(contact_w_snapped, 0), window_w)

    const portfolio_w = window_w - contact_w

    contact.style.width = contact_w + "px"
    portfolio.style.width = portfolio_w + "px"
})

document.addEventListener("mouseup", () => {
    ctx.dragging = false
})

ctx.apply_colorscheme()
