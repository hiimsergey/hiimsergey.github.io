import { COMMANDS } from "./commands.js"
import { ctx, completion, input } from "./script.js"

// TODO NOTE it should also trigger on commands like :colo and :help
export function construct_completions() {
    while (completion.firstChild) completion.firstChild.remove()

    const command = input.value.slice(1)

    if (command[command.length - 1] === " ") {
        const cmd = command.slice(0, command.length - 1)
        for (const CMDOBJ of COMMANDS) {
            if (cmd === CMDOBJ.cmd) {
                ctx.completion.options = [cmd, ...CMDOBJ.completions()]
                break
            }
        }
    } else {
        // TODO NOTE when cycling when tab, it doesnt jump to the
        // first one again, it goes back to the cmd part
        ctx.completion.options = [command, ...COMMANDS
            .filter(CMDOBJ => !CMDOBJ.short)
            .map(CMDOBJ => CMDOBJ.cmd)
            .filter(cmd => cmd.startsWith(command))]
    }

    if (ctx.completion.options.length === 1) return

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

    // TODO change position

    cycle_completions()
    if (ctx.completion.options.length > 2) ctx.completion.trigger = cycle_completions
    else reset_completions()
}

export function reset_completions() {
    ctx.completion.cur = 0
    ctx.completion.trigger = construct_completions
    completion.style.display = "none"
}
    
function cycle_completions() {
    // TODO handle one child in completions
    completion.children[ctx.completion.cur].style.backgroundColor = "unset"
    ctx.completion.cur = (ctx.completion.cur + 1) % ctx.completion.options.length
    completion.children[ctx.completion.cur].style.backgroundColor = "red" // TODO

    input.value = ":" + ctx.completion.options[ctx.completion.cur]
}
