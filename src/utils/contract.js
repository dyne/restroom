import { SMART_CONTRACTS } from './config'

const fs = require('fs')
const ic = require('ignore-case')
let cache = {}

export const getContent = (zencode) => {
    if (zencode in cache) {
        return cache[zencode]
    }

    const content = fs.readFileSync(`${SMART_CONTRACTS}/${zencode}`).toString()
    cache[zencode] = content
    return cache[zencode]
}

export const getScenario = (zencode) => {
    const content = getContent(zencode)
    for (const line of content.split('\n')) {
        if (ic.startsWith(line.trim(), 'SCENARIO')) {
            return line.trim()
        }
    }
    return null
}

export const getData = (zencode, fn) => {
    const scenario = getScenario(zencode)
    if (scenario !== null) {
        const words = scenario.split(":")
        if (words) {
            return fn(words)
        }
    }

    return ""
}

export const getSummary = (zencode) => {
    return getData(zencode, words => words[1].trim())
}

export const getTag = (zencode) => {
    return getData(zencode, words => words[0].replace(/(Scenario )/i, ''))
}