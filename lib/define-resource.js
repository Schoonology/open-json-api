function buildRelationshipSpec (description) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['data'],
    properties: {
      data: buildRelationshipProperties(description)
    }
  }
}

function buildRelationshipProperties (description) {
  if (!description) {
    return null
  }

  if (Array.isArray(description)) {
    return {
      type: 'array',
      items: buildRelationshipProperties(description[0])
    }
  }

  if (typeof description === 'object') {
    return {
      allOf: [
        buildIdentifierRef(description.name),
        {
          meta: {
            type: 'object',
            properties: description.meta
          }
        }
      ]
    }
  }

  return buildIdentifierRef(description)
}

function buildIdentifierRef (name) {
  return {
    $ref: '#/definitions/' + name + 'Identifier'
  }
}

function getRequiredAttributes(options) {
  return []
}

module.exports = function defineResource (spec, name, options) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  if (!options || !options.type) {
    throw new TypeError('Type option is required.')
  }

  spec = Object.assign({}, spec)

  spec.definitions = Object.assign({}, spec.definitions)

  spec.definitions[name + 'Identifier'] = {
    type: 'object',
    additionalProperties: false,
    required: ['type', 'id'],
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type)
      },
      id: {
        type: 'string'
      }
    }
  }

  spec.definitions[name] = {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type)
      },
      id: {
        type: 'string'
      },
      attributes: {
        type: 'object',
        additionalProperties: false,
        properties: options.attributes || {}
      },
      relationships: {
        type: 'object',
        additionalProperties: false,
        properties: {}
      }
    }
  }

  Object.keys(options.relationships || {})
    .forEach(function (key) {
      spec.definitions[name].properties.relationships.properties[key] = buildRelationshipSpec(options.relationships[key])
    })

  if (Array.isArray(options.links) && options.links.length) {
    spec.definitions[name].properties.links = {
      type: 'object',
      properties: {}
    }

    options.links.forEach(function (link) {
      spec.definitions[name].properties.links.properties[link] = {
        type: 'string',
        format: 'url'
      }
    })
  }

  return spec
}
