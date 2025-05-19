import { PAGES } from "./pages.js"
import { VERSION, colo, curbuf, editor, lualine, pageCache, setColo, setCurbuf,
    textarea } from "./main.js"
import { Buffer, Container, ResizeHandle, equalizeBufferHeights, equalizeBufferWidths } from "./buffers.js"
import { applyColorscheme, COLORSCHEMES } from "./colorschemes.js"

// TODO ! handling for all commands
const newcmd = (
    name,
    callback,
    completions = [],
    hidden = false
) => ({ name, hidden, callback, completions })

const isNumber = ch => (ch >= '0' && ch <= '9')

export const COMMANDS = [
    newcmd("colorscheme", colorscheme, COLORSCHEMES.map(COLO => COLO.name)),
    newcmd("edit", edit, PAGES),
    newcmd("pwd", pwd),
    newcmd("split", split, PAGES),
    // TODO ADD :verbose/:verb
    newcmd("version", version),
    newcmd("vsplit", vsplit, PAGES),
    newcmd("quit", quit)
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
    if (!command.name) return

    const candidates = COMMANDS.filter(CMD => CMD.name.startsWith(command.name))
    if (candidates.length === 1) {
        candidates[0].callback(command)
        return
    }

    const match = candidates.find(cand => cand.name === command.name)
    if (match) {
        match.callback(command)
        return
    }

    textarea.error("E492: Not an editor command: " + prompt)
}

function parseCommand(prompt) {
    if (!prompt) return { name: null, args: [], prefix: null, exclamation: false}

    let i = 0
    while (isNumber(prompt[i]) && i < prompt.length) ++i
    const prefix = i ? prompt.slice(0, i) : null

    const nameStart = i
    while(prompt[i] !== ' ' && !isNumber(prompt[i]) && i < prompt.length) ++i

    let exclamation = false
    const name = (() => {
        if (nameStart >= i) return null
        if (prompt[i - 1] === "!") {
            exclamation = true
            return prompt.slice(nameStart, i - 1)
        }
        return prompt.slice(nameStart, i)
    })()
    
    const suffixStart = i
    while (isNumber(prompt[i]) && i < prompt.length) ++i
    const suffix = suffixStart < i ? prompt.slice(suffixStart, i) : null

    const args = prompt.trim().split(" ").slice(1)

    return { name, args: suffix ? [suffix, ...args] : args, prefix, exclamation }
}

function colorscheme(cmd) {
    if (cmd.exclamation) {
        textarea.error("E477: No ! allowed")
        return
    }

    if (cmd.prefix) {
        textarea.error("E481: No range allowed")
        return
    }

    if (!cmd.args.length) {
        textarea.log(COLORSCHEMES[colo].name)
        return
    }

    const name = cmd.args.join(" ")
    const i = COLORSCHEMES.findIndex(COLO => COLO.name === name)

    if (i === -1) {
        textarea.error(`E185: Cannot find color scheme '${name}'`)
        return
    }

    setColo(i)
    applyColorscheme()
}

export function edit(cmd) {
    if (cmd.prefix) {
        textarea.error("E481: No range allowed")
        return
    }

    if (!cmd.args.length) return

    const file = cmd.args.join(" ")

    const target = curbuf // Avoids async-related race conditions
    curbuf.filename.innerText = file // TODO CONSIDER using curbuf instead of target
    lualine.filename.innerText = file
    history.pushState(null, "", "/" + file)

    if (pageCache[file]) {
        target.content = pageCache[file]
        return
    }

    if (!PAGES.includes(file)) {
        edit({ args: ["404.html"] })
        return
    }

    fetch("_pages/" + file)
        .then(res => res.text())
        .then(html => {
            // TODO NOW DEBUG v
            target.content.innerHTML = html
                .trimEnd() // Exclude empty last line
                .split("\n")
                .map(line => "<div>" + line + "</div>")
                .join("\n")
            pageCache[file] = html
        })
}

function pwd(cmd) {
    if (cmd.prefix) {
        textarea.error("E481: No range allowed")
        return
    }

    if (cmd.args.length) {
        textarea.error("E488: Trailing characters: ", cmd.args.join(" "))
        return
    }
    
    // TODO TEST
    textarea.log(window.location.origin)
}

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

    if (cmd.args.length) console.log("<args>: ", cmd.args.join(" "), cmd.args.length)
    else console.log("</args>: ", oldbufName, cmd.args.length)

    if (cmd.args.length) edit({ args: cmd.args })
    else edit({ args: [oldbufName] })
}

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

// TODO MOVE + USE
function findNextBuffer() {
    // TODO NOW remove the original node
    // make the one the curbuf
    let buf = curbuf

    while (true) {
        buf = buf.nextSibling
        if (!buf) return null
        if (buf.classList.contains("handle")) {
            let handle = buf
            buf = buf.nextSibling
            handle.remove()
        }
        // TODO ADD container class in CSS
        while (buf.classList.contains("container")) buf = buf.children[0]
        return buf
    }

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
}
