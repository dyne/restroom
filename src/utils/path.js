import { SMART_CONTRACTS } from "./config"
import chalk from "chalk"
import fs from "fs"

export const ls = () => {
    const items = fs.readdirSync(SMART_CONTRACTS)
    const files = {}
    for (const item of items) {
        const p = item.split('.')[0]
        files[`${p}`] = item
    }
    return files
}


export const printPaths = () => {
    const files = ls()
    for (const k in files) {
        console.log(`/${chalk.bold(k)} \t🔄\t ${files[k]}`)
    }
}