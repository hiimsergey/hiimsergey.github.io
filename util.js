import { ctx, lualine } from "./main.js"

export function setCurbuf(div) {
    console.log(div)
    ctx.curbuf.children[1].style.display = "flex"
    div.children[1].style.display = "none"
    div.appendChild(lualine)
    ctx.curbuf = div

    lualine.filename.innerText = ctx.curbuf.filename.innerText
    history.pushState(null, "", "/" + ctx.curbuf.filename.innerText)
    console.log("---")
}

export function findNextBuffer() {
    // TODO NOW remove the original node
    // make the one the ctx.curbuf
    let buf = ctx.curbuf
    buf = buf.nextElementSibling

    if (buf.classList.contains("handle")) {
        let handle = buf
        buf = buf.nextElementSibling
        handle.remove()
    }
    while (buf.classList.contains("container")) buf = buf.firstChild

    return buf
}

export function findPrevBuffer() {
    // TODO NOW remove the original node
    // make the one the ctx.curbuf
    let buf = ctx.curbuf
    buf = buf.previousElementSibling

    if (buf.classList.contains("handle")) {
        let handle = buf
        buf = buf.previousElementSibling
        handle.remove()
    }
    while (buf.classList.contains("container")) buf = buf.children[0]

    return buf
}

export function findBufferLeft() {
    let buf = ctx.curbuf
    while (buf.parentElement.style.flexDirection !== "row") {
        if (buf.parentElement.id) return null
        buf = ctx.curbuf.parentElement
    }

    if (!buf.previousSibling) return null
    buf = buf.previousElementSibling.previousElementSibling
    while (buf.classList.contains("container")) buf = buf.firstChild

    return buf
}

export function findBufferRight() {
    let buf = ctx.curbuf
    while (buf.parentElement.style.flexDirection !== "row") {
        if (buf.parentElement.id) return null
        buf = ctx.curbuf.parentElement
    }

    if (!buf.nextElementSibling) return null
    buf = buf.nextElementSibling.nextElementSibling
    while (buf.classList.contains("container")) buf = buf.firstChild

    return buf
}

export function findBufferAbove() {
    let buf = ctx.curbuf
    while (buf.parentElement.style.flexDirection !== "column") {
        if (buf.parentElement.id) return null
        buf = ctx.curbuf.parentElement
    }

    if (!buf.previousElementSibling) return null
    buf = buf.previousElementSibling
    while (buf.classList.contains("container")) buf = buf.firstChild

    return buf
}

export function findBufferBelow() {
    let buf = ctx.curbuf
    while (buf.parentElement.style.flexDirection !== "column") {
        if (buf.parentElement.id) return null
        buf = ctx.curbuf.parentElement
    }

    if (!buf.nextElementSibling) return null
    buf = buf.nextElementSibling
    while (buf.classList.contains("container")) buf = buf.firstChild

    return buf
}
