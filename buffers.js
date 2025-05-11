import { ch, curbuf, drag, setCurbuf } from "./main.js"

const filename = document.createElement("div")
filename.classList.add("filename")

export function Buffer() {
    const result = document.createElement("div")
    result.classList.add("buffer")
    result.addEventListener("click", () => setCurbuf(result))

        const viewport = document.createElement("div")
        viewport.classList.add("viewport")
        result.appendChild(viewport)
            
            const content = document.createElement("div")
            content.classList.add("content")
            viewport.appendChild(content)

        const bar = document.createElement("div")
        bar.classList.add("bar")
        result.appendChild(bar)
        
            const filename = document.createElement("div")
            filename.classList.add("filename")
            filename.innerText = "[No name]"
            bar.appendChild(filename)
        
            const position = document.createElement("div")
            position.classList.add("position")
            position.innerText = "1:1"
            bar.appendChild(position)

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

// TODO FINAL OPTIMIZE ALL appendChild(foo); appendChild(bar) -> append(foo, bar)
export function Lualine() {
    const result = document.createElement("div")
    result.id = "lualine"

        const lualineLeft = document.createElement("div")
        lualineLeft.classList.add("lualine-side")
        result.appendChild(lualineLeft)

            const lualineA = document.createElement("div")
            lualineA.id = "lualine-a"
            lualineLeft.appendChild(lualineA)

                const mode = document.createElement("div")
                mode.classList.add("mode")
                mode.innerText = "NORMAL"
                lualineA.appendChild(mode)

                const git = document.createElement("div")
                git.classList.add("git")
                git.innerText = " main"
                lualineA.appendChild(git)

            lualineLeft.appendChild(filename)

        const lualineRight = document.createElement("div")
        lualineRight.classList.add("lualine-side")
        result.appendChild(lualineRight)
        result.appendChild(lualineRight)

            const lualineY = document.createElement("div")
            lualineY.id = "lualine-y"
            lualineRight.appendChild(lualineY)

                const filetype = document.createElement("div")
                filetype.classList.add("filetype")
                filetype.innerHTML = "<span style='color: #e34c26'></span> html"
                lualineY.appendChild(filetype)

                const percentage = document.createElement("div")
                percentage.classList.add("percentage")
                percentage.innerText = "Top"
                lualineY.appendChild(percentage)

                const position = document.createElement("div")
                position.classList.add("position")
                position.innerText = "1:1"
                lualineY.appendChild(position)

                const wrap = document.createElement("div")
                wrap.classList.add("wrap")
                wrap.innerText = "󰖶 wrap"
                lualineY.appendChild(wrap)

                const htmlPreview = document.createElement("div")
                htmlPreview.classList.add("html-preview")
                htmlPreview.innerText = " html-preview"
                lualineY.appendChild(htmlPreview)

            const lualineZ = document.createElement("div")
            lualineZ.id = "lualine-z"
            lualineRight.appendChild(lualineZ)

    return result
}

export function curbufName() {
    return curbuf.children[1].children[0].innerText
}

export function setBarFilename(name) {
    curbuf.children[1].children[0].innerText = name
}

export function setLualineFilename(name) {
    filename.innerText = name
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
