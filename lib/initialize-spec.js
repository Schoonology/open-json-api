module.exports = function initializeSpec (options) {
  options = options || {}

  return {
    swagger: '2.0',
    produces: ['application/json'],
    info: {
      title: String(options.title || 'Open JSON API'),
      version: String(options.version || '0.0.0')
    },
    paths: {}
  }
}
