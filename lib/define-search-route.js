var defaultsDeep = require('lodash.defaultsdeep')

module.exports = function defineSearchRoute (name, additionalOptions) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  return defaultsDeep({}, additionalOptions, {
    responses: {
      200: {
        description: 'Successful search response for ' + name + '.',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['data'],
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/definitions/' + name
              }
            }
          }
        }
      }
    }
  })
}
