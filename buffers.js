const filename = document.createElement("div")
filename.id = "lualine-a"

export function new_buffer() {
    const result = document.createElement("div")
    result.classList.add("buffer")

        const viewport = document.createElement("div")
        viewport.classList.add("viewport")
        result.appendChild(viewport)

        const bar = document.createElement("div")
        bar.classList.add("bar")
        result.appendChild(bar)

    return result
}

export function init_lualine() {
    const result = document.createElement("div")
    result.id = "lualine"

        const lualine_left = document.createElement("div")
        lualine_left.classList.add("lualine-side")

            const lualine_a = document.createElement("div")
            lualine_a.id = "lualine-a"
            lualine_left.appendChild(lualine_a)

            lualine_left.appendChild(filename)

        result.appendChild(lualine_left)

        const lualine_right = document.createElement("div")
        lualine_right.classList.add("lualine-side")
        result.appendChild(lualine_right)

            const lualine_y = document.createElement("div")
            lualine_y.id = "lualine-a"
            lualine_left.appendChild(lualine_y)

            const lualine_z = document.createElement("div")
            lualine_z.id = "lualine-a"
            lualine_left.appendChild(lualine_z)

        result.appendChild(lualine_left)

    return result
}

export function set_lualine_filename(name) {
    filename.innerText = name
    console.log(filename.innerText)
}
