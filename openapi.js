const util = require('./utils')

let openapi = {
  openapi: '3.0.2',
  info: {
    title: 'Restroom',
    version: '1.0.0',
    description: `This is a simple API autogenerated from a folder within your server.

To add new endpoints you should add new zencode contracts in \`${util.config.path}\`.
    
**NB** The files should be in form of \`endpoint.zen\` then your contract will run on \`/endpoint\`
    `,
    termsOfService: "https://zenroom.org/privacy",
    contact: {
      email: "dev@dyne.org"
    },
    license: {
      name: "GNU Affero General Public License v3.0 or later",
      url: "https://www.gnu.org/licenses/agpl-3.0"
    }
  },
  servers: [{     
      description: 'development local server', 
      url: "http://{host}:{port}/{basePath}",
      variables: {
        port: {
          enum: [
            util.config.port
          ],
          default: util.config.port
        },
        host: { default: util.config.host },
        basePath: { default: 'api' }
      }
    }],
  schemes: ["http"],
  paths: {}
}


const generate = () => {
  const paths = util.ls()
  const mime = [ "application/json" ]
  const parameters = [
    {
      required: false,
      schema: {
        title: 'Data',
        type: 'string'
      },
      name: 'data',
      in: 'query'
    },
    {
      required: false,
      schema: {
        title: 'Keys',
        type: 'string'
      },
      name: 'keys',
      in: 'query'
    }
  ]
  const responses = {
    200: {
      description: 'Successful Response',
      content: {
        'application/json': {
          schema: {}
        }
      }
    },
    500: {
      description: 'Error Response',
      content: {
        'text/plain; charset=utf-8': {
          schema: {}
        }
      }
    }
  }
  
  for (const path in paths) {
    const description = util.getContent(paths[path])
    const summary = util.getSummary(paths[path])
    const tag = `🔖 ${util.getTag(paths[path])}`
    let endpoint = {
      get: {
        summary: summary,
        description: description,
        tags: [tag],
        consumes: mime,
        produces: mime,
        operationId: `_function_${path}_get`,
        parameters: parameters,
        responses: responses
      },
      post: {
        summary: summary,
        description: description,
        tags: [tag],
        consumes: mime,
        produces: mime,
        operationId: `_function_${path}_post`,
        parameters: parameters,
        responses: responses
      }
    }
  
    openapi.paths[`/${path}`] = endpoint
  }

  return openapi
}


exports.generate = generate
