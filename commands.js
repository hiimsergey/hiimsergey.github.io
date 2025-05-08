import { PAGES } from "./pages.js"
import { cellH, ch, curbuf, pageCache, setCurbuf, textarea } from "./main.js"
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
        // TODO VERIFY is it realistic + IMPLEMENT + COLOR
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
    target.children[1].innerHTML = file
    setLualineFilename(file)

    // TODO TEST kaumon
    if (pageCache[file]) {
        target.children[0].innerHTML = pageCache[file]
            .trimEnd()
            .split("\n")
            .map(line => "<div>" + line + "</div>")
            .join("\n")
        return
    }

    // TODO but add "html-preview" to lualine
    if (!PAGES.includes(file)) {
        target.children[0].innerHTML = ""
        // TODO CONSIDER putting into cache
        return
    }

    // TODO TEST kaumon
    fetch(`_pages/${file}`)
        .then(res => res.text())
        .then(html => {
            target.children[0].innerHTML = html
                .trimEnd()
                .split("\n")
                .map(line => "<div>" + line + "</div>")
                .join("\n")
            pageCache[file] = html
        })
}

function split(args) {
    const oldbuf = curbufName()
    const buffer = newBuffer()

    if (curbuf.parentElement.style.flexDirection === "column") {
        curbuf.before(buffer)
    } else {
        const vcontainer = newContainer("column")
        curbuf.replaceWith(vcontainer)
        vcontainer.append(buffer, curbuf)
    }

    setCurbuf(buffer)

    if (args.length) edit([args.join(" ")])
    else edit([oldbuf])

    // Equalize heights of layout children
    const totalH = buffer.parentElement.clientHeight
    const bufN = buffer.parentElement.children.length
    const bufH = (totalH - cellH * (bufN - 1)) / bufN
    for (const buf of buffer.parentElement.children) {
        buf.style.width = "100%" // TODO CONSIDER
        buf.style.height = bufH + "px"
    }
}

export function vsplit(args) {
    const oldbuf = curbufName()

    const buffer = newBuffer()
    const handle = newHandle()

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

    if (args.length) edit([args.join(" ")])
    else edit([oldbuf])

    // Equalize widths of layout children
    const totalW = buffer.parentElement.clientWidth
    const bufN = buffer.parentElement.children.length
    const bufW = (totalW - ch * (bufN - 1)) / bufN
    for (let i = 0; i < buffer.parentElement.children.length; i += 2)
        buffer.parentElement.children[i].style.width = bufW + "px"
}

function quit() {
    window.open(window.location, "_self").close()
}
