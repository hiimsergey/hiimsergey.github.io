import { ctx, cellH, ch, editor, root } from "./main.js"
import { setCurbuf } from "./util.js"

export function Buffer() {
    const result = document.createElement("div")
    result.classList.add("buffer")

        const viewport = document.createElement("div")
        viewport.classList.add("viewport")
        viewport.addEventListener("click", () => setCurbuf(result))
        viewport.addEventListener("wheel", e => {
            e.preventDefault()
            viewport.scrollTop += Math.sign(e.deltaY) * cellH
        }, { passive: false })
        result.appendChild(viewport)
            
            const content = document.createElement("div")
            content.classList.add("content")
            viewport.appendChild(content)

        const bar = document.createElement("div")
        bar.classList.add("bar")
        result.appendChild(bar)
        
            const filename = document.createElement("div")
            filename.classList.add("filename")
            filename.innerText = "[No Name]"
            bar.appendChild(filename)
        
            const position = document.createElement("div")
            position.classList.add("position")
            position.innerText = "1:1"
            bar.appendChild(position)

    result.filename = filename
    result.content = content
    return result
}

export function CompletionWindow() {
    const result = document.createElement("div")
    result.id = "completion"

        const selected = document.createElement("div")
        selected.id = "selected"
        result.appendChild(selected)

    root.appendChild(result)
    return result
}

export function Container(type) {
    const result = document.createElement("div")
    result.style.flexDirection = type
    result.classList.add("container")
    return result
}

// TODO FINAL OPTIMIZE ALL appendChild(foo); appendChild(bar) -> append(foo, bar)
export function Lualine() {
    const result = document.createElement("div")
    result.id = "lualine"

        const lualineLeft = document.createElement("div")
        lualineLeft.id = "lualine-left"
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

            const filename = document.createElement("div")
            filename.classList.add("filename")
            filename.innerText = "[No Name]"
            lualineLeft.appendChild(filename)

        const lualineRight = document.createElement("div")
        lualineRight.id = "lualine-right"
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

    // TODO DEBUG
    result.filename = filename
    return result
}

// TODO add a visual line to handles
export function ResizeHandle() {
    const result = document.createElement("div")
    result.classList.add("handle")

    result.addEventListener("mousedown", (e) => {
        ctx.handle = result
        e.preventDefault() // Prevent selecting text while dragging

        document.addEventListener("mousemove", resizeHorizontally)
        document.addEventListener("mouseup", resizeStop)
    })

    return result
}

export function equalizeBufferWidths(container) {
    const totalW = container.clientWidth
    const bufN = container.children.length
    const bufW = (totalW - ch * (bufN - 1)) / bufN
    for (let i = 0; i < container.children.length; i += 2)
        container.children[i].style.flex = bufW
}

export function equalizeBufferHeights(container) {
    const totalH = container.clientHeight
    const bufN = container.children.length
    const bufH = (totalH - cellH * (bufN - 1)) / bufN
    for (const buf of container.children) buf.style.flex = bufH + "px"
}

// TODO NOW DEBUG
function resizeHorizontally(e) {
    const leftRect = ctx.handle.previousElementSibling.getBoundingClientRect()
    const leftWRaw = e.clientX - leftRect.left
    const leftW = Math.floor(leftWRaw / ch) * ch
    ctx.handle.previousElementSibling.style.flex = leftW

    const rightRect = ctx.handle.nextElementSibling.getBoundingClientRect()
    const rightWRaw = rightRect.right - e.clientX
    const rightW = Math.ceil(rightWRaw / ch) * ch
    ctx.handle.nextElementSibling.style.flex = rightW
}

function resizeStop() {
    document.removeEventListener("mousemove", resizeHorizontally)
    document.removeEventListener("mouseup", resizeStop)
}
