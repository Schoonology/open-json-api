var defaultsDeep = require('lodash.defaultsdeep')

function getIncludeParameter(withIncludes = {}) {
  var keys = Object.keys(withIncludes)

  if (!keys.length) {
    return []
  }

  return [{
    name: 'include',
    in: 'query',
    type: 'array',
    items: {
      type: 'string',
      enum: keys
    }
  }]
}

function getIncludedBodyProperty(withIncludes = {}) {
  var keys = Object.keys(withIncludes)

  if (!keys.length) {
    return {}
  }

  return {
    included: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            enum: keys.map(key => withIncludes[key])
          }
        }
      }
    }
  }
}

module.exports = function defineGetRoute (name, additionalOptions = {}) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  var withIncludes = additionalOptions && additionalOptions.withIncludes
  delete additionalOptions.withIncludes

  return defaultsDeep({}, additionalOptions, {
    parameters: [
      ...getIncludeParameter(withIncludes)
    ],
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
            meta: {
              type: 'object'
            },
            ...getIncludedBodyProperty(withIncludes)
          }
        }
      }
    }
  })
}
