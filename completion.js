import { COMMANDS } from "./commands.js"
import { ctx, completion, input } from "./script.js"

// TODO NOTE it should also trigger on commands like :colo and :help
export function construct_completions() {
    ctx.completion.input = input.value

    while (completion.firstChild) completion.firstChild.remove()

    const command = ctx.completion.input.slice(1)

    if (command.endsWith(" ")) {
        const cmd = COMMANDS.find(CMD => CMD.name === command.trim())
        if (cmd) ctx.completion.options = ["", ...cmd.completions]
    } else {
        const words = command.split(" ")
        console.log(words)

        if (words.length === 1) {
            // TODO NOTE :colorscheme gruv| should also complete
            // TODO NOTE when cycling when tab, it doesnt jump to the
            // first one again, it goes back to the cmd part
            ctx.completion.options = [
                "",
                ...COMMANDS
                    .filter(CMD => !CMD.short)
                    .map(CMD => CMD.name)
                    .filter(cmd => cmd.startsWith(words[0]))
            ]
        } else {
            const cmd = COMMANDS.find(CMD => CMD.name === words[0])
            ctx.completion.options = cmd ?
                cmd.completions.filter(cmp => cmp.startsWith(words[words.length - 1])) :
                []
        }
    }

    // TODO if (ctx.completion.options.length === 1) return

    for (const option of ctx.completion.options) {
        const div = document.createElement("div")
        div.innerText = option
        completion.appendChild(div)
    }

    completion.style.display = "block"
    // TODO CHECK
    completion.style.width =
        Math.max(...ctx.completion.options.map(option => option.length)) + 4 + "ch"
    completion.style.height = ctx.completion.options.length - 1 + "em"

    // Don't display the original command in the completion menu
    completion.children[0].style.display = "none"

    completion.style.left = ctx.completion.input.length + "ch"

    cycle_completions()
    if (ctx.completion.options.length > 2) ctx.completion.trigger = cycle_completions
    else reset_completions()
}

export function reset_completions() {
    completion.style.display = "none"
    ctx.completion.input = ""
    ctx.completion.trigger = construct_completions
    ctx.completion.cur = 0
}
    
function cycle_completions() {
    // TODO handle one child in completions
    completion.children[ctx.completion.cur].style.backgroundColor = "unset"
    ctx.completion.cur = (ctx.completion.cur + 1) % ctx.completion.options.length
    completion.children[ctx.completion.cur].style.backgroundColor = "red" // TODO

    if (ctx.completion.input.endsWith(" ")) {
        input.value = ctx.completion.input + ctx.completion.options[ctx.completion.cur]
    } else {
        console.log("cycling ocmpletions")
        let words = ctx.completion.input.slice(1).split(" ")
        words[words.length - 1] = ctx.completion.options[ctx.completion.cur]
        input.value = ":" + words.join(" ")
    }
}

// TODO DEBUG :colorscheme co| <tab>
// TODO DEBUG :c gruvbox-material| <tab>
// TODO DEBUG :ajfdlkadsjflds| <tab>
/* TODO
 * :one| -> ": " + option
 * :one | -> input.value + option
 * :one two| -> words[0] + " " + option
 * :one two | -> input.value + option
*/
