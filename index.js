const fs = require('fs')
const util = require('./utils')
const express = require('express')
const chalk = require('chalk')
const zenroom = require('zenroom')
const bodyParser = require('body-parser')
const capcon = require('capture-console')
const swaggerUi = require('swagger-ui-express')
const oa = require('./openapi')

const conf = util.config
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('json spaces', 2)

const requestHandler = (req, res) => {
  if (req.url === '/favicon.ico') { return }
  res.header("X-Powered-By", "Restroom")
  let result = ''
  const name = req.url.split('/')[2]
  const errors = []
  const contract = fs.readFileSync(`${conf.path}/${name}.zen`).toString()
  var stderr = capcon.captureStderr(function scope () {
    zenroom
      .script(contract)
      .conf(req.body.conf)
      .data(req.body.data)
      .keys(req.body.keys)
      .print_err(text => errors.push(text))
      .print(text => { result = result.concat(text) })
      .error(() => res.status(500))
      .zencode_exec()
  })
  try {
    res.json(JSON.parse(result))
  } catch (e) {
    res.status(500).send(stderr)
  }
}

app.get('/api/*', requestHandler)
app.post('/api/*', requestHandler)

const options = {
  customCss: `.swagger-ui .topbar a img {
    content: url(https://zenroom.org/wp-content/uploads/2019/11/zenroom-1024x205.png);
 } .swagger-ui .topbar { background-color: #dedede }`
};

app.use('/', (req, res, next) => {
  let swaggerDoc = oa.generate()
  swaggerDoc.servers[0].variables.host = { default: req.hostname }
  req.swaggerDoc = swaggerDoc
  next()
}, swaggerUi.serve, swaggerUi.setup(null, options))

app.listen(conf.port, conf.host, () => {
  console.log('Restroom started on ' + chalk`{bold.blue http://0.0.0.0:${conf.port}\n}`)
  console.log(`ZENCODE DIR: ${chalk.magenta.underline(conf.path)}\n`)
  console.log('Serving:\n')
  util.printPaths()
})
