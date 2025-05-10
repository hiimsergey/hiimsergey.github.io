import { PAGES } from "./pages.js"
import { cellH, ch, curbuf, editor, pageCache, setCurbuf, textarea } from "./main.js"
import { Buffer, Container, Handle, curbufName, setLualineFilename } from "./buffers.js"

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
        console.error(err)
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
    history.pushState(null, "", "/" + file)

    if (pageCache[file]) {
        target.children[0].children[0].innerHTML = pageCache[file]
            .trimEnd()
            .split("\n")
            .map(line => "<div>" + line + "</div>")
            .join("\n")
        return
    }

    // TODO but add "html-preview" to lualine
    if (!PAGES.includes(file)) {
        target.children[0].innerHTML = "<div class='content'><div></div></div>"
        // TODO CONSIDER putting into cache
        return
    }

    fetch("_pages/" + file)
        .then(res => res.text())
        .then(html => {
            target.children[0].children[0].innerHTML = html
                .trimEnd()
                .split("\n")
                .map(line => "<div>" + line + "</div>")
                .join("\n")
            pageCache[file] = html
        })
}

export function split(args) {
    const oldbuf = curbufName()
    const buffer = Buffer()

    if (curbuf.parentElement.style.flexDirection === "column") {
        curbuf.before(buffer)
    } else {
        const column = Container("column")
        curbuf.replaceWith(column)
        column.append(buffer, curbuf)
    }

    setCurbuf(buffer)

    if (args.length) edit([args.join(" ")])
    else edit([oldbuf])

    // Equalize heights of layout children
    const totalH = buffer.parentElement.clientHeight
    const bufN = buffer.parentElement.children.length
    const bufH = (totalH - cellH * (bufN - 1)) / bufN
    for (const buf of buffer.parentElement.children) {
        buf.style.width = "100%"
        buf.style.height = bufH + "px"
    }
}

export function vsplit(args) {
    const oldbuf = curbufName()

    const buffer = Buffer()
    const handle = Handle()

    if (curbuf.parentElement.style.flexDirection === "row") {
        curbuf.before(buffer, handle)
    } else {
        const row = Container("row")
        curbuf.replaceWith(row)
        row.append(buffer, handle, curbuf)
    }

    setCurbuf(buffer)

    if (args.length) edit([args.join(" ")])
    else edit([oldbuf])

    // Equalize widths of layout children
    const totalW = buffer.parentElement.clientWidth
    const bufN = buffer.parentElement.children.length
    const bufW = (totalW - ch * (bufN - 1)) / bufN
    for (let i = 0; i < buffer.parentElement.children.length; i += 2) {
        buffer.parentElement.children[i].style.width = bufW + "px"
        buffer.parentElement.children[i].style.height = "100%"
    }
}

function quit() {
    if (editor.children.length === 1) {
        window.open(window.location, "_self").close()
        return
    }

    if (curbuf.parentElement.firstElementChild === curbuf) {
        // TODO DEBUG dont do two steps in vertical containers
        setCurbuf(curbuf.parentElement.children[2])
        curbuf.parentElement.children[0].remove()
        curbuf.parentElement.children[0].remove()
        return
    }

    // TODO DEBUG dont do two steps in vertical containers
    setCurbuf(curbuf.previousSibling.previousSibling)
    curbuf.nextSibling.remove()
    curbuf.nextSibling.remove()
    if (curbuf.parentElement.children.length === 1)
        curbuf.parentElement.replaceWith(curbuf)
}
