import { PAGES } from "./pages.js"
import { curbuf, pages, setCurbuf, textarea } from "./main.js"
import { curbufName, newBuffer, newContainer, newHandle,
    setLualineFilename } from "./buffers.js"

export const COMMANDS = [
    { name: "edit", hidden: false, callback: edit, completions: PAGES },
    { name: "e", hidden: true, callback: edit, completions: PAGES },

    { name: "split", hidden: false, callback: split, completions: PAGES },
    { name: "sp", hidden: true, callback: split, completions: PAGES },

    { name: "vsplit", hidden: false, callback: vsplit, completions: PAGES },
    { name: "vs", hidden: true, callback: vsplit, completions: PAGES },
]

export function executeCommand() {
    console.log(`TODO execute this command: '${textarea.value.slice(1)}'`)
}

export function edit(args) {
    if (args.length === 1) return
    const file = args.slice(1).join(" ")

    const target = curbuf // Avoids async-related race conditions
    target.children[1].innerHTML = file + ".portfolio"
    setLualineFilename(file + ".portfolio")

    if (pages[file]) {
        target.children[0].innerHTML = pages[file]
        return
    }

    fetch(`_pages/${file}.html`)
        .then(res => res.text())
        .then(html => {
            target.children[0].innerHTML = html
            pages[file] = html
        })
}

export function split(args) {
    const oldbuf = curbufName()

    const buffer = newBuffer()
    const handle = newHandle("hhandle")

    if (curbuf.parentElement.style.flexDirection === "column") {
        console.log("pushing to the old container")
        curbuf.before(buffer, handle)
    } else {
        console.log("making a new container")
        const vcontainer = newContainer("column")
        curbuf.replaceWith(vcontainer)
        vcontainer.append(buffer, handle, curbuf)
    }

    setCurbuf(buffer)

    if (args.length > 1) edit(["", args.slice(1).join(" ")])
    else edit(["", oldbuf])
}

export function vsplit(args) {
    const oldbuf = curbufName()

    const buffer = newBuffer()
    const handle = newHandle("vhandle")

    if (curbuf.parentElement.style.flexDirection === "row") {
        console.log("pushing to the old container")
        curbuf.before(buffer, handle)
    } else {
        console.log("making a new container")
        const hcontainer = newContainer("row")
        curbuf.replaceWith(hcontainer)
        hcontainer.append(buffer, handle, curbuf)
    }

    setCurbuf(buffer)

    if (args.length > 1) edit(["", args.slice(1).join(" ")])
    else edit(["", oldbuf])
}
