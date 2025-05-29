import { PAGES } from "./pages.js"
import { VERSION, ctx, editor, lualine, textarea } from "./main.js"
import { Buffer, Container, ResizeHandle, equalizeBufferHeights, equalizeBufferWidths } from "./buffers.js"
import { applyColorscheme, COLORSCHEMES } from "./colorschemes.js"
import { findNextBuffer, findPrevBuffer, setCurbuf } from "./util.js"

// TODO ! handling for all commands
const newcmd = (
    name,
    callback,
    completions = [],
    hidden = false
) => ({ name, hidden, callback, completions })

const isNumber = ch => (ch >= '0' && ch <= '9')

export const COMMANDS = [
    newcmd("Norsu",         Norsu),

    newcmd("colorscheme",   colorscheme, COLORSCHEMES.map(COLO => COLO.name)),
    newcmd("edit",          edit,        PAGES),
    newcmd("pwd",           pwd),
    newcmd("split",         split,       PAGES),
    // TODO ADD :verbose/:verb
    newcmd("version",       version),
    newcmd("vsplit",        vsplit,      PAGES),
    newcmd("quit",          quit)
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
    if (!prompt) return { name: null, args: [], range: null, bang: false}

    let i = 0
    while (isNumber(prompt[i]) && i < prompt.length) ++i
    const range = i ? prompt.slice(0, i) : null

    const nameStart = i
    while(prompt[i] !== ' ' && !isNumber(prompt[i]) && i < prompt.length) ++i

    let bang = false
    const name = (() => {
        if (nameStart >= i) return null
        if (prompt[i - 1] === "!") {
            bang = true
            return prompt.slice(nameStart, i - 1)
        }
        return prompt.slice(nameStart, i)
    })()
    
    const suffixStart = i
    while (isNumber(prompt[i]) && i < prompt.length) ++i
    const suffix = suffixStart < i ? prompt.slice(suffixStart, i) : null

    const args = prompt.trim().split(" ").slice(1)

    return { name, args: suffix ? [suffix, ...args] : args, range, bang }
}

// TODO CONSIDER FIX to support /norsu
function Norsu() { window.open("/norsu/") }

function colorscheme(cmd) {
    if (cmd.bang) {
        textarea.error("E477: No ! allowed")
        return
    }

    if (cmd.range) {
        textarea.error("E481: No range allowed")
        return
    }

    if (!cmd.args.length) {
        textarea.log(COLORSCHEMES[ctx.colo].name)
        return
    }

    const name = cmd.args.join(" ")

    for (let i = 0; i < COLORSCHEMES.length; ++i) {
        if (name === COLORSCHEMES[i].name) {
            ctx.colo = i
            applyColorscheme()
            return
        }
    }

    textarea.error(`E185: Cannot find color scheme '${name}'`)
    return
}

export function edit(cmd) {
    console.log(cmd)

    if (cmd.range) {
        textarea.error("E481: No range allowed")
        return
    }
    if (!cmd.args.length) return

    let file = cmd.args.join(" ").replace(/%20/g, " ")
    history.pushState(null, "", "/" + file)

    const target = ctx.curbuf // Avoids async-related race conditions
    target.filename.innerText = file
    lualine.filename.innerText = file

    if (ctx.pageCache[file]) {
        target.content.innerHTML = ctx.pageCache[file]
        return
    }

    if (!PAGES.includes(file)) file = "404.html"

    fetch("_pages/" + file)
        .then(res => res.text())
        .then(html => {
            target.content.innerHTML = html
                .trimEnd() // Exclude empty last line
                .split("\n")
                .map(line => "<div>" + line + "</div>")
                .join("\n")
            ctx.pageCache[file] = target.content.innerHTML
        })
}

function pwd(cmd) {
    if (cmd.range) {
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
    const oldbufName = ctx.curbuf.filename.innerText
    const buf = Buffer()

    if (ctx.curbuf.parentElement.style.flexDirection === "column") {
        ctx.curbuf.before(buf)
    } else {
        const col = Container("column")
        ctx.curbuf.replaceWith(col)
        col.append(buf, ctx.curbuf)
    }

    setCurbuf(buf)

    if (cmd.args.length) console.log("<args>: ", cmd.args.join(" "), cmd.args.length)
    else console.log("</args>: ", oldbufName, cmd.args.length)

    if (cmd.args.length) edit({ args: cmd.args })
    else edit({ args: [oldbufName] })

    if (cmd.range) buf.style.flex = cmd.range
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

// TODO CONSIDER "set splitbelow splitright"
export function vsplit(cmd) {
    const oldbufName = ctx.curbuf.filename.innerText
    const buf = Buffer()
    const handle = ResizeHandle()

    if (ctx.curbuf.parentElement.style.flexDirection === "row") {
        ctx.curbuf.before(buf, handle)
    } else {
        const row = Container("row")
        ctx.curbuf.replaceWith(row)
        row.append(buf, handle, ctx.curbuf)
    }

    // TODO CONSIDER make it ctx.curbuf.set(buf) or buf.makeCurbuf()
    setCurbuf(buf)

    if (cmd.args.length) edit({ args: cmd.args })
        // TODO NOW DEBUG this opens [No name]
    else edit({ args: [oldbufName] })

    if (cmd.range) buf.style.flex = cmd.range
}

function quit(cmd) {
    if (cmd.range) {
        textarea.error("E16: Invalid range")
        return
    }

    if (editor.children.length === 1 && editor.firstChild.classList.contains("buffer")) {
        window.open(window.location, "_self").close()
        return
    }

    const buf = ctx.curbuf.parentElement.firstElementChild === ctx.curbuf ?
        findNextBuffer() :
        findPrevBuffer()
    const oldbuf = ctx.curbuf
    setCurbuf(buf)
    oldbuf.remove()

    // Don't let ctx.curbuf escape #editor
    if (!ctx.curbuf.parentElement.id && ctx.curbuf.parentElement.children.length === 1)
        ctx.curbuf.parentElement.replaceWith(ctx.curbuf)
}
