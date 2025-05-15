import { PAGES } from "./pages.js"
import { VERSION, cellH, ch, colo, curbuf, editor, lualine, pageCache, setCurbuf,
    textarea } from "./main.js"
import { Buffer, Container, ResizeHandle, equalizeBufferHeights, equalizeBufferWidths } from "./buffers.js"
import { COLORSCHEMES } from "./colorschemes.js"

export const COMMANDS = [
    { name: "colorscheme", hidden: false, callback: colorscheme, completions: [/* TODO */]},
    { name: "colo", hidden: true, callback: colorscheme, completions: [/* TODO */]},

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
    { name: "quit!", hidden: true, callback: quit, completions: [] },
    { name: "q", hidden: true, callback: quit, completions: [] },
    { name: "q!", hidden: true, callback: quit, completions: [] }
]

export function executeCommand() {
    const prompt = textarea.value.replace(/^:+/, "")

    if (prompt[0] === "!") {
        // TODO VERIFY is it realistic + IMPLEMENT + COLOR
        const shellCmd = prompt.slice(1)
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

    const command = parseCommand(prompt)

    const candidates = COMMANDS.filter(CMD => CMD.name.startsWith(command.name))
    if (candidates.length === 1) {
        candidates[0].callback(command)
        return
    }

    const finding = candidates.find(cand => cand.name === command.name)
    if (finding) {
        finding.callback(command)
        return
    }

    textarea.error("E492: Not an editor command: " + prompt)
}

function parseCommand(prompt) {
    if (!prompt) return { name: null, args: [], prefix: null }

    let i = 0
    while (!isNaN(prompt[i]) && i < prompt.length) ++i
    const prefix = i ? prompt.slice(0, i) : null

    const nameStart = i
    while(isNaN(prompt[i]) && i < prompt.length) ++i
    const name = nameStart < i ? prompt.slice(nameStart, i) : null
    
    const suffixStart = i
    while (!isNaN(prompt[i]) && i < prompt.length) ++i
    const suffix = suffixStart < i ? prompt.slice(suffixStart, i) : null

    const args = prompt.trim().split(" ").slice(1)

    return { name, args: suffix ? [suffix, ...args] : args, prefix }
}

function colorscheme(cmd) {
    if (!cmd.args.length) textarea.log(COLORSCHEMES[colo].name)
}

export function edit(cmd) {
    if (cmd.prefix) {
        textarea.style.color = COLORSCHEMES[colo].error
        textarea.style.fontStyle = "italic"
        textarea.value = "E481: No range allowed"
        return
    }

    if (!cmd.args.length) return

    const file = cmd.args.join(" ")

    const target = curbuf // Avoids async-related race conditions
    curbuf.filename.innerText = file // TODO CONSIDER using this instead of target
    lualine.filename.innerText = file
    console.log("file: ", file)
    history.pushState(null, "", "/" + file)

    if (pageCache[file]) {
        edit({ args: ["404.html"] })
        return
    }

    if (!PAGES.includes(file)) {
        target.children[0].innerHTML = "<div class='content'><div></div></div>"
        // TODO CONSIDER putting into cache
        return
    }

    fetch("_pages/" + file)
        .then(res => res.text())
        .then(html => {
            target.children[0].children[0].innerHTML = html
                .trimEnd() // Exclude empty last line
                .split("\n")
                .map(line => "<div>" + line + "</div>")
                .join("\n")
            pageCache[file] = html
        })
}

function pwd(cmd) {
    if (cmd.prefix) {
        textarea.style.color = COLORSCHEMES[colo].error
        textarea.style.fontStyle = "italic"
        textarea.value = "E481: No range allowed"
        return
    }

    if (cmd.args.length) {
        textarea.style.color = COLORSCHEMES[colo].error
        textarea.style.fontStyle = "italic"
        textarea.value = "E488: Trailing characters: " + cmd.args.join(" ")
        return
    }
    
    // TODO TEST
    textarea.log(window.location.origin)
}

// TODO NOW
export function split(cmd) {
    const oldbufName = curbuf.filename.innerText
    const buffer = Buffer()

    if (curbuf.parentElement.style.flexDirection === "column") {
        curbuf.before(buffer)
    } else {
        const column = Container("column")
        curbuf.replaceWith(column)
        column.append(buffer, curbuf)
    }

    setCurbuf(buffer)

    if (cmd.length) edit({ name: cmd.join(" ") })
    else edit({ name: oldbufName })
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

export function vsplit(cmd) {
    const oldbufName = curbuf.filename.innerText

    const buf = Buffer()
    const handle = ResizeHandle()

    if (curbuf.parentElement.style.flexDirection === "row") {
        curbuf.before(buf, handle)
    } else {
        const row = Container("row")
        curbuf.replaceWith(row)
        row.append(buf, handle, curbuf)
    }

    // TODO CONSIDER make it curbuf.set(buf) or buf.makeCurbuf()
    setCurbuf(buf)

    // TODO NOW DEBUG why does this open 404?
    if (cmd.args.length) edit({ args: [cmd.args.join(" ")] })
    else edit({ args: [oldbufName] })

    if (cmd.args.length) console.log("<args>: ", cmd.args.join(" "))
    console.log("</args>: ", oldbufName)
    console.log("either way: ", cmd)

    if (cmd.prefix) buf.style.width = cmd.prefix + "px" // TODO TEST
}

function quit() {
    if (editor.children.length === 1 && editor.firstChild.classList.contains("buffer")) {
        window.open(window.location, "_self").close()
        return
    }

    if (curbuf.parentElement.firstElementChild === curbuf) {
        if (curbuf.parentElement.style.flexDirection === "column") {
            // TODO NOW DEBUG it takes focuses the next buffer, regardless whether
            // its a buffer or a container
            // What if you could just find the next/previous .buffer.div?
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
