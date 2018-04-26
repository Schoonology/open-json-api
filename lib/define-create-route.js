var defaultsDeep = require('lodash.defaultsdeep')

module.exports = function defineCreateRoute (name, additionalOptions) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  var required = {}
  if (additionalOptions && additionalOptions.required) {
    required = additionalOptions.required
    delete additionalOptions.required
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
            allOf: [{
              $ref: '#/definitions/' + name
            }, {
              required: [
                'type',
                required.attributes && 'attributes',
                required.relationships && 'relationships'
              ].filter((s) => !!s)
            },
            required.relationships && {
              properties: {
                relationships: {
                  required: required.relationships
                }
              }
            },
            required.attributes && {
              properties: {
                attributes: {
                  required: required.attributes
                }
              }
            }
            ].filter((s) => !!s)
          }
        }
      }
    })
  }

  return routeSpec
}
