import { ctx, input } from "./main.js"

export function init_command_history() {
    console.log("init")
    //if (!ctx.history.commands.history.length) return // TODO CHECk
    //ctx.history.commands.history.push(input.value)
    //ctx.history.commands.trigger = navigate_command_history
    //ctx.history.commands.cur = ctx.history.commands.history.length - 2
    //input.value = ctx.history.commands.history[ctx.history.commands.cur]

    // TODO NOW + PLAN
    // copy this from the top but make it better
    // the goal is to push current input, but make .cur to the previously last one
    // THAT MATCHES THE PATTERN OF THE INPUT
    if (!ctx.history.commands.history.length) return // TODO CHECK
    //ctx.history.commands.cur = ctx.history.commands.history.length - 1
    //input.value = ctx.history.commands.history[ctx.history.commands.history.length - 1]
    ctx.history.commands.history.push(input.value)
    ctx.history.commands.cur = ctx.history.commands.history.length - 1
    ctx.history.commands.trigger = navigate_command_history
    navigate_command_history(true)
}

// TODO NOW CHECK
// TODO PLAN + NOTE reset_command_history()
// called on Escape and Enter
// checks if the last typed command was a new one or from history
// either way append it to history
// if from history, dont copy but move
export function reset_command_history() {
    if (ctx.history.commands.trigger === navigate_command_history)
        ctx.history.commands.history.pop()

    if (ctx.history.commands.cur !== ctx.history.commands.history.length - 1) {
        ctx.history.commands.history
            .push(ctx.history.commands.history.splice(ctx.history.commands.cur, 1)[0])
        // TODO REMOVE
        //for (
        //    let i = ctx.history.commands.cur;
        //    i < ctx.history.commands.history.length - 1;
        //) ctx.history.commands.history[i] = ctx.history.commands.history[++i]

        //ctx.history.commands.history[ctx.history.commands.history.length - 1] =
        //    input.value
    } else if (input.value.trim() !== ":") ctx.history.commands.history.push(input.value)
 
    ctx.history.commands.cur = ctx.history.commands.history.length - 1
    ctx.history.commands.trigger = init_command_history

    console.log(ctx.history.commands.history)
}

function navigate_command_history(up) {
    const original = ctx.history.commands.history[ctx.history.commands.history.length - 1]
    let cmp = ctx.history.commands.cur

    if (up) {
        while (cmp) {
            if (ctx.history.commands.history[cmp - 1].startsWith(original)) {
                input.value = ctx.history.commands.history[cmp - 1]
                ctx.history.commands.cur = cmp - 1
                return
            }
            --cmp
        }
    } else {
        while (cmp < ctx.history.commands.history.length - 1) {
            if (ctx.history.commands.history[cmp + 1].startsWith(original)) {
                input.value = ctx.history.commands.history[cmp + 1]
                ctx.history.commands.cur = cmp + 1
                return
            }
            ++cmp
        }
    }
}
