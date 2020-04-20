import { getContent } from '../utils/contract'

const zenroom = require('zenroom')
const capcon = require('capture-console')

export default (req, res, next) => {
    if (req.url === '/favicon.ico') { return }
    res.append("X-Powered-By", "Restroom")
    let result = ''
    const errors = []
    const contractName = req.originalUrl.split('/')[2]
    const contract = getContent(`${contractName}.zen`)
    var stderr = capcon.captureStderr(function scope() {
        zenroom
            .script(contract)
            .conf(req.body.conf)
            .data(req.body.data)
            .keys(req.body.keys)
            .print_err(text => errors.push(text))
            .print(text => { result = result.concat(text) })
            .error(() => res.status(500))
            .success(() => {
                const pze = res.locals.onPostZenroomExecution || []
                for (const fn of res.locals.onPostZenroomExecution) {
                    fn(contract, result, res)
                }
            })
            .zencode_exec()
    })
    try {
        res.json(JSON.parse(result))
    } catch (e) {
        res.status(500).send(stderr)
    }
}