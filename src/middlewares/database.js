import { parseZencode } from "../utils/zencode_parser"
import { Sequelize } from "sequelize"

const actions = {
    'CONNECT': 'I have the database connection uri {}',
    'SAVE': 'save the result into the database'
}


export default (req, res, next) => {
    let pze = res.locals.onPostZenroomExecution || []
    pze.push((contract, result, res) => {
        const sentences = parseZencode(contract)
        let dbUrl;
        for (const sentence of sentences.keys()) {
            switch (sentence) {
                case actions.CONNECT:
                    dbUrl = sentences.get(actions.CONNECT)[0]
                    break
                case actions.SAVE:
                    console.log(dbUrl)
                    const db = new Sequelize(dbUrl)
                    const resultTable = db.define('results', { result: Sequelize.TEXT })
                    db.sync()
                        .then(() => {
                            resultTable.create({ result: result })
                        })
                    break
            }
        }
    })
    res.locals.onPostZenroomExecution = pze
    next()
}