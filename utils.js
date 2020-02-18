require('dotenv').config()
const fs = require('fs')
const chalk = require('chalk')
const ic = require('ignore-case')
let cache = {}

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  path: process.env.SMART_CONTRACTS
}

const ls = () => {
  const items = fs.readdirSync(config.path)
  const files = {}
  for (const item of items) {
    const p = item.split('.')[0]
    files[`${p}`] = item
  }
  return files
}

const printPaths = () => {
  const files = ls()
  for (const k in files) {
    console.log(`/${chalk.bold(k)} \t🔄\t ${files[k]}`)
  }
}

const coloredError = (error) => {
  for (const line of error.split('\n')) {
    if (line.startsWith('[!]')) { 
      console.error(chalk`{magenta ${line}}`) 
    } else if (line.startsWith('[W]')) { 
      console.error(chalk`{yellow ${line}}`) 
    } else if (line.startsWith('[*]')) { 
      console.error(chalk`{blue ${line}}`) 
    } else if (line.startsWith(' .  ')) { 
      console.error(chalk`{gray ${line}}`) 
    } else { console.error(line) }
  }
}

const getContent = (zencode) => {
  if (zencode in cache) {
    return cache[zencode]
  }

  const content = fs.readFileSync(`${config.path}/${zencode}`).toString()
  cache[zencode] = content
  return cache[zencode]
}

const getScenario = (zencode) => {
  const content = getContent(zencode)
  for (const line of content.split('\n')) {
    if (ic.startsWith(line.trim(), 'SCENARIO')) {
      return line.trim()
    }
  }
  return null
}

const getData = (zencode, fn) => {
  const scenario = getScenario(zencode)
  if (scenario !== null) {
    const words = scenario.split(":")
    if (words) {
      return fn(words)
    }
  }
  
  return ""
}

const getSummary = (zencode) => {
  return getData(zencode, words => words[1].trim())
}

const getTag = (zencode) => {
  return getData(zencode, words => words[0].replace(/(Scenario )/i, ''))
}

exports.ls = ls
exports.getTag = getTag
exports.config = config
exports.printPaths = printPaths
exports.coloredError = coloredError
exports.getSummary = getSummary
exports.getContent = getContent
