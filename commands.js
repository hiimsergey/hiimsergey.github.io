import { COLORSCHEMES } from "./colorschemes.js"
import { ctx, input } from "./script.js"

// TODO USE
export const COMMANDS = [
    { cmd: "", short: true, callback: () => {}, completions: () => [] },

    { cmd: "colorscheme", short: false, callback: colorscheme, completions: () => [] },
    { cmd: "colo", short: true, callback: colorscheme, completions: () => [] },

    { cmd: "quit", short: false, callback: quit, completions: () => [] },
    { cmd: "q!", short: true, callback: quit, completions: () => [] },
    { cmd: "q", short: true, callback: quit, completions: () => [] },
    // colorscheme
    // h
    // _ E21
    // _ every other command
    // hide
    // vs #
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

function quit(args) {
    window.open(window.location, "_self").close()
}
