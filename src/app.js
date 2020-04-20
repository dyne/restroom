import express from 'express'
import chalk from 'chalk'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import zencode from './middlewares/zencode'
import mw from './middlewares/generic_zencode'
import { generate } from './middlewares/openapi'
import { SMART_CONTRACTS, PORT, HOST } from './utils/config'
import { printPaths } from './utils/path'
import database from './middlewares/database'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('morgan')('dev'))
app.use(mw)
app.use(database)
app.use('/api/*', zencode)
app.set('json spaces', 2)

const options = {
    customCss: `.swagger-ui .topbar a img {
    content: url(https://dev.zenroom.org/_media/images/zenroom_logo.png);
 } .swagger-ui .topbar { background-color: #dedede }`
};

app.use('/', (req, res, next) => {
    let swaggerDoc = generate()
    swaggerDoc.servers[0].variables.host = { default: req.hostname }
    req.swaggerDoc = swaggerDoc
    next()
}, swaggerUi.serve, swaggerUi.setup(null, options))

app.listen(PORT, HOST, () => {
    console.log('Restroom started on ' + chalk `{bold.blue http://0.0.0.0:${PORT}\n}`)
    console.log(`ZENCODE DIR: ${chalk.magenta.underline(SMART_CONTRACTS)}\n`)
    console.log('Serving:\n')
    printPaths()
})