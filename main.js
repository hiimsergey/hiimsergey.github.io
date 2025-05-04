import { execute_command } from "./commands.js"

export const textarea = document.querySelector("textarea")

let ch, em, cell_h = 0

function resizeTextArea() {
    textarea.style.height = "var(--cell-h)"
    textarea.style.padding = "0"

    textarea.style.height =
        Math.floor(textarea.scrollHeight / cell_h) * cell_h + "px"
    if (parseFloat(textarea.style.height) > cell_h)
        textarea.style.padding = "var(--cell-h) 0 0 0"
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
    cell_h = 1.3 * em

    document.documentElement.style.setProperty(
        "--cell-h",
        cell_h + "px"
    )
    document.documentElement.style.setProperty(
        "--root-w",
        Math.floor(Math.floor(window.innerWidth / ch) * ch) + "px"
    )
    document.documentElement.style.setProperty(
        "--root-h",
        Math.floor(Math.floor(window.innerHeight / cell_h) * cell_h) + "px"
    )

    document.body.removeChild(span)
    console.log(ch, em, cell_h)
}

window.addEventListener("resize", () => {
    updateRoot()
    resizeTextArea()
})

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case ":":
            if (document.activeElement === textarea) break
            // TODO set color to normal and style to normal
            textarea.value = ""
            textarea.focus()
            break
    }
})

textarea.addEventListener("input", resizeTextArea)

textarea.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Enter":
            execute_command()
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
