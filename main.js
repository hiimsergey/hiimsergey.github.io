import { Buffer, Lualine } from "./buffers.js"
import { COLORSCHEMES, applyColorscheme } from "./colorschemes.js"
import { edit, executeCommand, split, vsplit } from "./commands.js"

export const VERSION = "0.1.7"
export const editor = document.getElementById("editor")
export const lualine = Lualine()
export const textarea = document.querySelector("textarea")
const firstBuffer = Buffer()

export let colo = Math.floor(Math.random() * COLORSCHEMES.length)
export let curbuf = firstBuffer
export let drag = { handle: null }
export let pageCache = {}
export let ch, em, cellH = 0

textarea.log = function(msg) {
    textarea.style.color = COLORSCHEMES[colo].text
    textarea.style.fontStyle = "normal"
    textarea.value = msg
}

textarea.error = function(msg) {
    textarea.style.color = COLORSCHEMES[colo].error
    textarea.style.fontStyle = "italic"
    textarea.value = msg
}

export function setColo(i) { colo = i }

export function setCurbuf(div) {
    curbuf.children[1].style.display = "flex"
    div.children[1].style.display = "none"
    div.appendChild(lualine)
    curbuf = div

    lualine.filename.innerText = curbuf.filename.innerText
    history.pushState(null, "", "/" + curbuf.filename.innerText)
}

function resizeTextArea() {
    textarea.style.height = cellH + "px"
    textarea.style.padding = "0"

    textarea.style.height =
        Math.floor(textarea.scrollHeight / cellH) * cellH + "px"
    if (parseFloat(textarea.style.height) > cellH)
        textarea.style.padding = cellH + "px 0 0 0"
}

function updateRoot() {
    const span = document.createElement("span")
    span.innerText = "0"
    span.style.position = "absolute"
    span.style.visibility = "hidden"
    span.style.font = getComputedStyle(document.body).font

    document.body.appendChild(span)

    const dimensions = span.getBoundingClientRect()
    ch = Math.floor(dimensions.width)
    em = parseFloat(getComputedStyle(document.documentElement).fontSize)
    cellH = 1.3 * em

    document.documentElement.style.setProperty(
        "--cell-h",
        cellH + "px"
    )
    document.documentElement.style.setProperty(
        "--root-w",
        Math.floor(Math.floor(window.innerWidth / ch) * ch) + "px"
    )
    document.documentElement.style.setProperty(
        "--root-h",
        Math.floor(Math.floor(window.innerHeight / cellH) * cellH) + "px"
    )

    document.body.removeChild(span)
}

window.addEventListener("resize", () => {
    updateRoot()
    resizeTextArea()
})

// TODO FINAL CONSIDER
// window.addEventListener("beforeunload", (e) => {
//     e.preventDefault()
//     e.returnValue = ""
// })

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case ":":
            if (document.activeElement === textarea) break
            textarea.style.color = COLORSCHEMES[colo].text
            textarea.style.fontStyle = "normal"
            textarea.value = ""
            textarea.focus()
            break
        case "i":
        case "I":
        case "o":
        case "O":
        case "a":
        case "A":
            if (document.activeElement === textarea) break
            textarea.style.color = COLORSCHEMES[colo].error
            textarea.style.fontStyle = "italic"
            textarea.value = "E21: Cannot make changes, 'modifiable' is off"
            break
    }
})

textarea.addEventListener("input", resizeTextArea)

textarea.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Enter":
            executeCommand()
            textarea.blur()
            break
        case "Escape":
            textarea.value = ""
            textarea.blur()
            resizeTextArea()
            break
    }
})

updateRoot()
editor.style.flexDirection = "row" // Necessary for reading later
editor.appendChild(firstBuffer)

if (window.location.pathname === "/") {
    // TODO FINAL TEST
    edit({ args: ["portfolio.html"] })
    if (window.innerWidth >= 950) vsplit({ args: ["contact.html"], prefix: 20 })
    else { split({ args: ["contact.html"] }) }
} else {
    edit({ args: [window.location.pathname.slice(1)] })
    setCurbuf(firstBuffer)
}

applyColorscheme()
