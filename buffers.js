import { curbuf } from "./main.js"

const filename = document.createElement("div")
filename.id = "lualine-a"

export function newBuffer() {
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

    return result
}

// TODO add a visual line to handles
export function newHandle() {
    const result = document.createElement("div")
    result.classList.add("handle")
    return result
}

export function newContainer(type) {
    const result = document.createElement("div")
    result.classList.add(type)
    return result
}

export function initLualine() {
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
