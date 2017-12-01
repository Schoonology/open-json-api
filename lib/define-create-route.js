var defaultsDeep = require('lodash.defaultsdeep')

module.exports = function defineCreateRoute (name, additionalOptions) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  var routeSpec = defaultsDeep({}, additionalOptions, {
    parameters: [],
    responses: {
      201: {
        description: 'Successful create response for ' + name + '.',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['data'],
          properties: {
            data: {
              $ref: '#/definitions/' + name
            },
            included: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            meta: {
              type: 'object'
            }
          }
        }
      }
    }
  })

  if (!routeSpec.parameters.some(function (parameter) {
    return parameter.in === 'body'
  })) {
    routeSpec.parameters.push({
      name: String(name).toLowerCase(),
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['data'],
        properties: {
          data: {
            $ref: '#/definitions/' + name
          }
        }
      }
    })
  }

  return routeSpec
}
