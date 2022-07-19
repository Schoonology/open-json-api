var CASTS_FOR_TYPE = {
  string: String,
  number: parseFloat,
  integer: parseInt,
  boolean: Boolean,
  array: function noop (_) { return _ },
  file: function noop (_) { return _ },
  object: function noop (_) { return _ }
}

module.exports = function normalizeAttributes (props, data) {
  var keys = Object.keys(props)

  if (!data) {
    return null
  }

  return keys
    .filter(function (key) {
      return typeof data[key] !== 'undefined'
    })
    .reduce(function (attrs, key) {
      var cast = CASTS_FOR_TYPE[props[key].type]
      if (!cast) {
        throw new Error('Unknown type: ' + props[key].type)
      }
      attrs[key] = cast(data[key])
      return attrs
    }, {})
}
