import { COLORSCHEMES } from "./colorschemes.js"
import { ctx, input } from "./script.js"

export const SET_OPTIONS = [
    // TODO
]

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

const colorscheme_completions = COLORSCHEMES.map(COLO => COLO.name)

function quit(args) {
    window.open(window.location, "_self").close()
}

// TODO USE
export const COMMANDS = [
    { name: "", short: true, callback: () => {}, completions: () => [] },

    { name: "colorscheme", short: false, callback: colorscheme, completions: colorscheme_completions },
    { name: "colo", short: true, callback: colorscheme, completions: colorscheme_completions },

    { name: "quit", short: false, callback: quit, completions: [] },
    { name: "q!", short: true, callback: quit, completions: [] },
    { name: "q", short: true, callback: quit, completions: [] },
    // colorscheme
    // h
    // _ E21
    // _ every other command
    // hide
    // vs #
]
