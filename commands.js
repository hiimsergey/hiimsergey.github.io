import { PAGES } from "./pages.js"
import { cellH, curbuf, pageCache, setCurbuf, textarea } from "./main.js"
import { curbufName, newBuffer, newContainer, newHandle,
    setLualineFilename } from "./buffers.js"

export const COMMANDS = [
    { name: "edit", hidden: false, callback: edit, completions: PAGES },
    { name: "e", hidden: true, callback: edit, completions: PAGES },

    { name: "split", hidden: false, callback: split, completions: PAGES },
    { name: "sp", hidden: true, callback: split, completions: PAGES },

    { name: "vsplit", hidden: false, callback: vsplit, completions: PAGES },
    { name: "vs", hidden: true, callback: vsplit, completions: PAGES },

    { name: "quit", hidden: false, callback: quit, completions: [] },
    { name: "q", hidden: true, callback: quit, completions: [] },
    { name: "q!", hidden: true, callback: quit, completions: [] }
]

export function executeCommand() {
    const command = textarea.value.replace(/^:+/, "")

    if (command[0] === "!") {
        // TODO VERIFY is is realistic + IMPLEMENT + COLOR
        const shellCmd = command.slice(1)
        // TODO CONSIDER trim
        const tildes = "~".repeat(shellCmd.trim().length - 2)
        const err = `:!${shellCmd}
sh: Unknown command: ${shellCmd}
sh:
${shellCmd}
^${tildes}^

shell returned 127

Press ENTER or type command to continue`
        console.log(err)
    }

    const args = command.trim().split(" ")

    for (const CMD of COMMANDS) {
        if (args[0] === CMD.name) {
            CMD.callback(args.slice(1))
            return
        }
    }

    // TODO make red (theme-specific), italic and write errmsg
    console.error("Invalid command")
}

export function edit(args) {
    if (!args.length) return
    const file = args.join(" ")

    const target = curbuf // Avoids async-related race conditions
    target.children[1].innerHTML = file + ".portfolio"
    setLualineFilename(file + ".portfolio")

    if (pageCache[file]) {
        target.children[0].innerHTML = pageCache[file]
        return
    }

    // TODO NOW ditch .portfolio in favor of html
    // but add "html-preview" to lualine
    if (!PAGES.includes(file + ".html")) {
        target.children[0].innerHTML = ""
        // TODO CONSIDER putting into cache
        return
    }

    fetch(`_pages/${file}.html`)
        .then(res => res.text())
        .then(html => {
            target.children[0].innerHTML = html
            pageCache[file] = html
        })
}

function split(args) {
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

    if (args.length) edit([args.slice(1).join(" ")])
    else edit([oldbuf])

    // TODO DEBUG + COPY to vsplit
    const totalH = buffer.parentElement.style.height
    const bufN = buffer.parentElement.children.length
    const bufH = (totalH - cellH * (bufN - 1)) / bufN
    for (const buf of buffer.parentElement.children) {
        console.log(buf.style.height)
        buf.style.height = bufH
    }
}

function vsplit(args) {
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

    if (args.length) edit([args.slice(1).join(" ")])
    else edit([oldbuf])
}

function quit() {
    window.open(window.location, "_self").close()
}
