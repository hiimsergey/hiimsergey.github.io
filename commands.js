import { COLORSCHEMES } from "./colorschemes.js"
import { contents, ctx, input } from "./main.js"

const completions_colorscheme = COLORSCHEMES.map(COLO => COLO.name)

function colorscheme(args) {
    switch (args.length) {
        case 1:
            input.value = COLORSCHEMES[ctx.colo].name
            return
        case 2:
            // TODO NOW TEST
            for (let i = 0; i < COLORSCHEMES.length; ++i) {
                if (args[1] === COLORSCHEMES[i].name) {
                    ctx.colo = i
                    ctx.apply_colorscheme()
                    return
                }
            }
        default:
            input.style.color = COLORSCHEMES[ctx.colo].h1
            input.style.fontStyle = "italic"
            input.value = `E185: Cannot find color scheme '${args.slice(1).join(" ")}'`
            return
    }
}

function set(args) {
    for (const arg of args.slice(1)) {
        const opt = SET_OPTIONS.find(SET => SET.name === arg)
        if (opt) { opt.callback() }
        else {
            input.style.color = COLORSCHEMES[ctx.colo].h1
            input.style.fontStyle = "italic"
            input.value = `E518: Unknown option: ${arg}`
        }
    }
}

function quit() {
    window.open(window.location, "_self").close()
}

export const SET_OPTIONS = [
    { name: "number", hidden: false, callback: set_number },
    { name: "nu", hidden: true, callback: set_number },

    { name: "number!", hidden: true, callback: set_number_exc },
    { name: "nu!", hidden: true, callback: set_number_exc },

    { name: "nonumber", hidden: false, callback: set_number_exc },
    { name: "nonu", hidden: true, callback: set_number_exc }
]

const completions_set = SET_OPTIONS.filter(SET => !SET.hidden).map(SET => SET.name)

// TODO USE
export const COMMANDS = [
    { name: "", hidden: true, callback: () => {}, completions: () => [] },

    { name: "colorscheme", hidden: false, callback: colorscheme, completions: completions_colorscheme },
    { name: "colo", hidden: true, callback: colorscheme, completions: completions_colorscheme },

    { name: "set", hidden: false, callback: set, completions: completions_set },
    { name: "se", hidden: true, callback: set, completions: completions_set },

    { name: "quit", hidden: false, callback: quit, completions: [] },
    { name: "q!", hidden: true, callback: quit, completions: [] },
    { name: "q", hidden: true, callback: quit, completions: [] },
    // colorscheme
    // h
    // _ E21
    // _ every other command
    // hide
    // vs #
]

function set_number() {
    document.documentElement.style.setProperty(
        "--display-line-numbers",
        "block"
    )
    // TODO DEBUG doesnt work
    for (const content of contents) content.style = "0 5ch"
}

function set_number_exc() {
    document.documentElement.style.setProperty(
        "--display-line-numbers",
        "none"
    )
    // TODO DEBUG doesnt work
    for (const content of contents) content.style.padding = "0 2ch"
}
