import { PAGES } from "./pages.js"
import { N_COMMANDS } from "./ncommands.js"
import { VERSION, cellH, ch, colo, curbuf, editor, pageCache, setCurbuf,
    textarea } from "./main.js"
import { Buffer, Container, Handle, curbufName, equalizeBufferHeights, equalizeBufferWidths, setBarFilename,
    setLualineFilename } from "./buffers.js"
import { COLORSCHEMES } from "./colorschemes.js"

export const COMMANDS = [
    { name: "edit", hidden: false, callback: edit, completions: PAGES },
    { name: "e", hidden: true, callback: edit, completions: PAGES },

    { name: "pwd", hidden: false, callback: pwd, completions: [] },
    { name: "pw", hidden: true, callback: pwd, completions: [] },

    { name: "split", hidden: false, callback: split, completions: PAGES },
    { name: "sp", hidden: true, callback: split, completions: PAGES },

    // TODO ADD :verbose/:verb

    { name: "version", hidden: false, callback: version, completions: [] },
    { name: "ver", hidden: true, callback: version, completions: [] },
    { name: "ve", hidden: true, callback: version, completions: [] },

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
        return
    }

    if (command[0] >= '0' && command[0] <= '9') {
        let i = 0
        while (command[i] >= '0' && command[i] <= '9') ++i
        const n = command.slice(0, i)
        const args = command.slice(i).trim().split(" ")
        console.log(n, args)

        for (const NCMD of N_COMMANDS) {
            if (args[0] === NCMD.name) {
                NCMD.callback(n, args.slice(1))
                return
            }
        }

        for (const CMD of COMMANDS) {
            if (args[0] === CMD.name) {
                console.error("E481: No range allowed")
                return
            }
        }

        console.error("Invalid command")
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
    setBarFilename(file)
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

// TODO DEBUG ":pwd3" should be treated like ":pwd 3"
function pwd(args) {
    if (args.length) console.error("E488: Trailing characters:", args.join(" "))
    textarea.style.color = COLORSCHEMES[colo].text
    textarea.style.fontStyle = "normal"
    textarea.value = window.location.origin
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
    
    equalizeBufferHeights()
}

// TODO CONSIDER ALL "if (args.length)" -> "if (args)"
function version(args) {
    if (args.length) return

    console.error(
`:version
${window.location.host} v${VERSION}
No build type
No LuaJIT
Don't run ":verbose version" for more info`
    )
}

export function vsplit(args) {
    const oldbuf = curbufName()

    const buf = Buffer()
    const handle = Handle()

    if (curbuf.parentElement.style.flexDirection === "row") {
        curbuf.before(buf, handle)
    } else {
        const row = Container("row")
        curbuf.replaceWith(row)
        row.append(buf, handle, curbuf)
    }

    setCurbuf(buf)

    if (args.length) edit([args.join(" ")])
    else edit([oldbuf])

    // TODO FINAL CONSIDER putting it into a function
    equalizeBufferWidths()
}

function quit() {
    if (editor.children.length === 1 && editor.firstChild.classList.contains("buffer")) {
        window.open(window.location, "_self").close()
        return
    }

    if (curbuf.parentElement.firstElementChild === curbuf) {
        if (curbuf.parentElement.style.flexDirection === "column") {
            setCurbuf(curbuf.nextSibling)
            curbuf.parentElement.firstChild.remove()
        } else {
            setCurbuf(curbuf.nextSibling.nextSibling)
            curbuf.parentElement.firstChild.remove()
            curbuf.parentElement.firstChild.remove()
        }
    } else if (curbuf.parentElement.style.flexDirection === "column") {
        setCurbuf(curbuf.previousSibling)
        curbuf.nextSibling.remove()
    } else {
        setCurbuf(curbuf.previousSibling.previousSibling)
        curbuf.nextSibling.remove()
        curbuf.nextSibling.remove()
    }

    if (!curbuf.parentElement.id && curbuf.parentElement.children.length === 1)
        curbuf.parentElement.replaceWith(curbuf)
}
