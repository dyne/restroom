import chalk from "chalk"

export const coloredError = (error) => {
    for (const line of error.split('\n')) {
        if (line.startsWith('[!]')) {
            console.error(chalk `{magenta ${line}}`)
        } else if (line.startsWith('[W]')) {
            console.error(chalk `{yellow ${line}}`)
        } else if (line.startsWith('[*]')) {
            console.error(chalk `{blue ${line}}`)
        } else if (line.startsWith(' .  ')) {
            console.error(chalk `{gray ${line}}`)
        } else { console.error(line) }
    }
}