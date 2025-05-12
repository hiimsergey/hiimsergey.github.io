import { cellH, ch, curbuf, drag, editor, setCurbuf } from "./main.js"

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
    result.style.flexDirection = type
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

                const modeSeparator = document.createElement("div")
                modeSeparator.id = "mode-separator"
                modeSeparator.innerText = "𜷄"
                lualineA.appendChild(modeSeparator)

                const git = document.createElement("div")
                git.classList.add("git")
                git.innerText = " main"
                lualineA.appendChild(git)

            const gitSeparator = document.createElement("div")
            gitSeparator.id = "git-separator"
            gitSeparator.innerText = "𜷄"
            lualineLeft.appendChild(gitSeparator)

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

                const filetypeSeparator = document.createElement("div")
                filetypeSeparator.id = "filetype-separator"
                filetypeSeparator.innerText = "𜵟"
                lualineY.appendChild(filetypeSeparator)

                const percentage = document.createElement("div")
                percentage.classList.add("percentage")
                percentage.innerText = "Top"
                lualineY.appendChild(percentage)

                const percentageSeparator = document.createElement("div")
                percentageSeparator.id = "percentage-separator"
                percentageSeparator.innerText = "𜵟"
                lualineY.appendChild(percentageSeparator)

                const position = document.createElement("div")
                position.classList.add("position")
                position.innerText = "1:1"
                lualineY.appendChild(position)

                const positionSeparator = document.createElement("div")
                positionSeparator.id = "position-separator"
                positionSeparator.innerText = "𜵟"
                lualineY.appendChild(positionSeparator)

                const wrap = document.createElement("div")
                wrap.classList.add("wrap")
                wrap.innerText = "󰖶 wrap"
                lualineY.appendChild(wrap)

                const wrapSeparator = document.createElement("div")
                wrapSeparator.id = "wrap-separator"
                wrapSeparator.innerText = "𜵟"
                lualineY.appendChild(wrapSeparator)

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

// TODO CONSIDER
export function equalizeBufferWidths() {
    const totalW = editor.clientWidth
    const bufN = editor.children.length
    const bufW = (totalW - ch * (bufN - 1)) / bufN
    for (let i = 0; i < editor.children.length; i += 2)
        editor.children[i].style.flex = bufW
}

export function equalizeBufferHeights() {
    const totalH = editor.clientHeight
    const bufN = editor.children.length
    const bufH = (totalH - cellH * (bufN - 1)) / bufN
    for (const buf of editor.children) buf.style.flex = bufH + "px"
}

function resizeHorizontally(e) {
    const leftRect = drag.handle.previousElementSibling.getBoundingClientRect()
    const leftWRaw = e.clientX - leftRect.left
    const leftW = Math.floor(leftWRaw / ch) * ch
    drag.handle.previousElementSibling.style.flex = leftW

    const rightRect = drag.handle.nextElementSibling.getBoundingClientRect()
    const rightWRaw = rightRect.right - e.clientX
    const rightW = Math.ceil(rightWRaw / ch) * ch
    drag.handle.nextElementSibling.style.flex = rightW
}

function resizeStop() {
    document.removeEventListener("mousemove", resizeHorizontally)
    document.removeEventListener("mouseup", resizeStop)
}
