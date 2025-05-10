import { ch, curbuf, drag, setCurbuf } from "./main.js"

const filename = document.createElement("div")
filename.id = "lualine-a"

export function Buffer() {
    const result = document.createElement("div")
    result.classList.add("buffer")

        const viewport = document.createElement("div")
        viewport.classList.add("viewport")
        result.appendChild(viewport)
            
            const content = document.createElement("div")
            content.classList.add("content")
            viewport.appendChild(content)

        const bar = document.createElement("div")
        bar.classList.add("bar")
        bar.innerText = "[No name]"
        result.appendChild(bar)

    result.addEventListener("click", () => setCurbuf(result))
    return result
}

// TODO add a visual line to handles
export function Handle() {
    const result = document.createElement("div")
    result.classList.add("handle")

    result.addEventListener("mousedown", (e) => {
        drag.handle = result
        e.preventDefault() // Prevent selecting text while dragging

        document.addEventListener("mousemove", resizeHorizontally)
        document.addEventListener("mouseup", resizeStop)
    })

    return result
}

export function Container(type) {
    const result = document.createElement("div")
    result.classList.add(type)
    return result
}

export function Lualine() {
    const result = document.createElement("div")
    result.id = "lualine"

        const lualineLeft = document.createElement("div")
        lualineLeft.classList.add("lualine-side")

            const lualineA = document.createElement("div")
            lualineA.id = "lualine-a"
            lualineLeft.appendChild(lualineA)

            lualineLeft.appendChild(filename)

        result.appendChild(lualineLeft)

        const lualineRight = document.createElement("div")
        lualineRight.classList.add("lualine-side")
        result.appendChild(lualineRight)

            const lualineY = document.createElement("div")
            lualineY.id = "lualine-a"
            lualineRight.appendChild(lualineY)

            const lualineZ = document.createElement("div")
            lualineZ.id = "lualine-a"
            lualineRight.appendChild(lualineZ)

        result.appendChild(lualineRight)

    return result
}

export function setLualineFilename(name) {
    filename.innerText = name
}

// TODO FINAL CHECK USE
export function curbufName() {
    return curbuf.children[1].innerHTML // TODO
}

function resizeHorizontally(e) {
    const leftRect = drag.handle.previousElementSibling.getBoundingClientRect()
    const leftWRaw = e.clientX - leftRect.left
    const leftW = Math.floor(leftWRaw / ch) * ch
    drag.handle.previousElementSibling.style.width = leftW + "px"

    const rightRect = drag.handle.nextElementSibling.getBoundingClientRect()
    const rightWRaw = rightRect.right - e.clientX
    const rightW = Math.ceil(rightWRaw / ch) * ch
    drag.handle.nextElementSibling.style.width = rightW + "px"
}

function resizeStop() {
    document.removeEventListener("mousemove", resizeHorizontally)
    document.removeEventListener("mouseup", resizeStop)
}
