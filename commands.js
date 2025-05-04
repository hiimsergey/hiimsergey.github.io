import { curbuf, textarea } from "./main.js"

export function execute_command() {
    console.log(`TODO execute this command: '${textarea.value.slice(1)}'`)
}

export function edit(args) {
    if (args.length === 1) return
    const file = args.slice(1).join(" ")

    const target = curbuf // To avoid async-related race conditions
    target.children[1].innerHTML = file + ".portfolio"

    fetch(`pages/${file}.html`)
        .then(res => res.text())
        .then(html => target.children[0].innerHTML = html)
}
