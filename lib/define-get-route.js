var defaultsDeep = require('lodash.defaultsdeep')

module.exports = function defineGetRoute (name, additionalOptions) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  return defaultsDeep({}, additionalOptions, {
    parameters: [],
    responses: {
      200: {
        description: 'Successful get response for ' + name + '.',
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
}
