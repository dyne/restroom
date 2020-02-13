const dotenv = require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
const zenroom = require('zenroom')
const bodyParser = require('body-parser')
const fs = require('fs')
const capcon = require('capture-console');


const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || '0.0.0.0'
const path = process.env.SMART_CONTRACTS;

fs.readdir(path, function(err, items) {
    for (var i=0; i<items.length; i++) {
        const p = items[i].split(".")[0]
        console.log(`/${chalk.bold(p)} \t🔄\t ${items[i]}`)
    }
})

app.set('json spaces', 2);

const request_handler = (req, res) => {
    if (req.url === '/favicon.ico')
        return
    let result = ""
    let errors = []
    const contract = fs.readFileSync(`${path}${req.url}.zen`).toString()
    var stderr = capcon.captureStderr(function scope() {
        zenroom
            .script(contract)
            .conf(req.body.conf)
            .data(req.body.data)
            .keys(req.body.keys)
            .print_err(text => errors.push(text))
            .print(text => result = result.concat(text))
            .error((e) => console.log(`ERRORE ${e}`))
            .zencode_exec()
    })
    try {
        res.json(JSON.parse(result))
    } catch(e) {
        res.status(500).send(stderr)
    }
}

app.get('/*', request_handler)
app.post('/*', request_handler)

app.listen(port, host, () => { 
    console.log('Restroom started on ' + chalk`{bold.blue http://0.0.0.0:${port}\n}`)
    console.log(`ZENCODE DIR: ${chalk.magenta.underline(path)}\n`)
    console.log(`Serving:`)
})