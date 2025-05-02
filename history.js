import { ctx, input } from "./main.js"

export function init_command_history() {
    if (!ctx.history.commands.history.length) return

    if (ctx.history.commands.history[ctx.history.commands.history.length - 1] !==
        input.value)
        ctx.history.commands.history.push(input.value)
    ctx.history.commands.cur = ctx.history.commands.history.length - 1
    ctx.history.commands.trigger = navigate_command_history
    navigate_command_history(true)
}

export function reset_command_history() {
    if (ctx.history.commands.trigger === navigate_command_history)
        ctx.history.commands.history.pop()

    if (ctx.history.commands.history[ctx.history.commands.history.length - 1] !==
        input.value) {
        if (ctx.history.commands.cur !== ctx.history.commands.history.length - 1) {
            ctx.history.commands.history
                .push(ctx.history.commands.history.splice(ctx.history.commands.cur, 1)[0])
        } else if (input.value.trim() !== ":")
            ctx.history.commands.history.push(input.value)
    }
 
    ctx.history.commands.cur = ctx.history.commands.history.length - 1
    ctx.history.commands.trigger = init_command_history
}

function navigate_command_history(up) {
    const original = ctx.history.commands.history[ctx.history.commands.history.length - 1]
    let cmp = ctx.history.commands.cur

    if (up) {
        while (cmp) {
            if (ctx.history.commands.history[cmp - 1].startsWith(original) &&
                ctx.history.commands.history[cmp - 1] !== original) {
                input.value = ctx.history.commands.history[cmp - 1]
                ctx.history.commands.cur = cmp - 1
                return
            }
            --cmp
        }
    } else {
        while (cmp < ctx.history.commands.history.length - 1) {
            if (ctx.history.commands.history[cmp + 1].startsWith(original) &&
                ctx.history.commands.history[cmp - 1] !== original) {
                input.value = ctx.history.commands.history[cmp + 1]
                ctx.history.commands.cur = cmp + 1
                return
            }
            ++cmp
        }
    }
}
