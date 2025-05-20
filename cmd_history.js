import { cmd_history, textarea } from "./main.js"

export function initCommandHistory() {
    console.log("TODO init cmd history")
    if (!cmd_history.items.length) return // TODO CONSIDER

    if (cmd_history.items[cmd_history.items.length - 1] !== textarea.value)
        cmd_history.items.push(textarea.value)
    cmd_history.cur = cmd_history.items.length - 1
    // TODO NOW DEBUG changing the trigger somehow doesnt work
    cmd_history.trigger = navigateCommandHistory
    navigateCommandHistory(true)
}

export function resetCommandHistory() {
    console.log("TODO reset cmd history")
    // If you were navigating the history before
    if (cmd_history.trigger === navigateCommandHistory)
        cmd_history.items.pop()

    if (cmd_history.items[cmd_history.items.length - 1] !== textarea.value) {
        if (cmd_history.cur !== cmd_history.items.length - 1) {
            // Move an older command to the end of the history
            cmd_history.items.push(cmd_history.items.splice(cmd_history.cur, 1)[0])
        } else if (textarea.value.trim() !== ":") cmd_history.items.push(textarea.value)
    }

    cmd_history.cur = cmd_history.items.length - 1
    cmd_history.trigger = initCommandHistory
}

function navigateCommandHistory(up) {
    console.log("TODO navigate cmd history")
    const original = cmd_history.items[cmd_history.items.length - 1]
    let cand = cmd_history.cur

    if (up) {
        while (cand) {
            if (cmd_history.items[cand - 1].startsWith(original) &&
                cmd_history.items[cand - 1] !== original) {
                textarea.value = cmd_history.items[cand - 1]
                cmd_history.cur = cand - 1
                return
            }
            --cand
        }
    } else {
        while (cand < cmd_history.items.length - 1) {
            if (cmd_history.items[cand + 1].startsWith(original) &&
                cmd_history.items[cand - 1] !== original) {
                textarea.value = cmd_history.items[cand + 1]
                cmd_history.cur = cand + 1
                return
            }
            ++cmp
        }
    }
}
