import { parseZencode } from "../utils/zencode_parser"

export default (req, res, next) => {
    let pze = res.locals.onPostZenroomExecution || []
    pze.push((contract, result, res) => {
        parseZencode(contract).entries()
    })
    res.locals.onPostZenroomExecution = pze
    next()
}