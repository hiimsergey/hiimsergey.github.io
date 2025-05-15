// TODO REMOVE ALL

import { PAGES } from "./pages.js"
import { split, vsplit } from "./commands.js"
import { cellH, ch, curbuf } from "./main.js"

export const N_COMMANDS = [
    { name: "split", hidden: false, callback: nSplit, completions: PAGES },
    { name: "sp", hidden: true, callback: nSplit, completions: PAGES },

    { name: "vsplit", hidden: false, callback: nVsplit, completions: PAGES },
    { name: "vs", hidden: true, callback: nVsplit, completions: PAGES },

    // TODO ADD
    //{ name: "quit", hidden: false, callback: quit, completions: [] },
    //{ name: "q", hidden: true, callback: quit, completions: [] },
    //{ name: "q!", hidden: true, callback: quit, completions: [] }
]

function nSplit(n, args) {
    split(args)
    curbuf.style.height = n * cellH + "px"
}

export function nVsplit(n, args) {
    vsplit(args)
    curbuf.style.width = n * ch + "px"
}
