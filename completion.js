import { COMMANDS } from "./commands.js"
import { ctx, completion, input } from "./main.js"

// TODO NOTE it should also trigger on commands like :colo and :help
export function construct_completions() {
    while (completion.firstChild) completion.firstChild.remove()

    ctx.completion.input = input.value

    const command = ctx.completion.input.slice(1)
    const words = command.split(" ")

    if (command.endsWith(" ")) {
        const cmd = COMMANDS.find(CMD => CMD.name === words[0])
        ctx.completion.options = cmd ? ["", ...cmd.completions] : [""]
    } else {
        if (words.length === 1) {
            // TODO NOTE :colorscheme gruv| should also complete
            // TODO NOTE when cycling when tab, it doesnt jump to the
            // first one again, it goes back to the cmd part
            ctx.completion.options = [
                [words[0]],
                ...COMMANDS
                    .filter(CMD => !CMD.hidden)
                    .map(CMD => CMD.name)
                    .filter(cmd => cmd.startsWith(words[0]))
            ]
        } else {
            const cmd = COMMANDS.find(CMD => CMD.name === words[0])
            ctx.completion.options = cmd ?
                [words[words.length - 1],
                    ...cmd.completions
                        .filter(cmp => cmp.startsWith(words[words.length - 1]))] :
                [words[words.length - 1]]
        }
    }

    for (const option of ctx.completion.options) {
        const div = document.createElement("div")
        div.innerText = option
        completion.appendChild(div)
    }
    completion.firstChild.id = "selected"

    completion.style.display = "block"
    completion.style.width =
        Math.max(...ctx.completion.options.map(option => option.length)) + 5 + "ch"
    // TODO completion.style.height = ctx.completion.options.length - 1 + "em"
    completion.style.height = `calc(${ctx.completion.options.length - 1} * var(--height-cell))`

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
    completion.children[ctx.completion.cur].removeAttribute("id")
    ctx.completion.cur = (ctx.completion.cur + 1) % ctx.completion.options.length
    completion.children[ctx.completion.cur].id = "selected"

    if (ctx.completion.input.endsWith(" ")) {
        input.value = ctx.completion.input + ctx.completion.options[ctx.completion.cur]
    } else {
        let words = ctx.completion.input.slice(1).split(" ")
        words[words.length - 1] = ctx.completion.options[ctx.completion.cur]
        input.value = ":" + words.join(" ")
    }
}
