import { COMMANDS } from "./commands.js"
import { cellH, completion, completionWindow, textarea } from "./main.js"

export function initCompletions(up) {
    while (completionWindow.firstChild) completionWindow.firstChild.remove()

    updateCompletions()

    for (const option of completion.options) {
        const div = document.createElement("div")
        div.innerText = option
        completionWindow.appendChild(div)
    }

    completionWindow.style.display = "block"
    completionWindow.style.height = (completion.options.length - 1) * cellH + "px"

    // Don't display the original command in the completion menu
    completionWindow.children[0].style.display = "none"

    // TODO CHECK
    const leftOffset = completion.input.indexOf(" ", 1)
    completionWindow.style.left = (leftOffset !== -1) * leftOffset + "ch"

    cycleCompletions(up)
    if (completion.options.length > 2) completion.trigger = cycleCompletions
    else resetCompletions()
}

export function resetCompletions() {
    completionWindow.style.display = "none"

    completion.input = ""
    completion.trigger = initCompletions
    completion.cur = 0
}

function updateCompletions() {
    completion.input = textarea.value

    const command = completion.input.slice(1) // Ignore the colon
    const words = command.split(" ")

    if (command.endsWith(" ")) {
        const candidates = COMMANDS.filter(CMD => CMD.name.startsWith(words[0]))
        completion.options =
            (candidates.length === 1) ? ["", ...candidates[0].completions] : [""]
        return
    }

    if (words.length === 1) {
        completion.options = [
            words[0], // TODO CHECK why not [words[0]]
            ...COMMANDS
                .filter(CMD => !CMD.hidden)
                .map(CMD => CMD.name)
                .filter(name => name.startsWith(words[0]))
        ]
    } else {
        const candidates = COMMANDS.filter(CMD => CMD.name.startsWith(words[0]))
        completion.options = (candidates.length === 1) ?
            [words[words.length - 1],
                ...candidates[0].completions
                .filter(cand => cand.startsWith(words[words.length - 1]))] :
            [words[words.length - 1]]
    }
}

function cycleCompletions(up) {
    completionWindow.children[completion.cur].removeAttribute("id")
    completion.cur =
        (completion.cur + (up ? completion.options.length - 1 : 1)) %
            completion.options.length
    completionWindow.children[completion.cur].id = "selected"

    if (completion.input.endsWith(" ")) {
        textarea.value = completion.input + completion.options[completion.cur]
    } else {
        let words = completion.input.slice(1).split(" ")
        words[words.length - 1] = completion.options[completion.cur]
        textarea.value = ":" + words.join(" ")
    }
}
