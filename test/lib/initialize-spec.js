var test = require('ava')
var initializeSpec = require('../../lib/initialize-spec')

test('initializeSpec returns the right Swagger version', t => {
  var subject = initializeSpec()

  t.is(subject.swagger, '2.0')
})

test('initializeSpec includes JSON in produces', t => {
  var subject = initializeSpec()

  t.deepEqual(subject.produces, ['application/json'])
})

test('initializeSpec includes the provided title in info', t => {
  var subject = initializeSpec({
    title: 'My awesome API'
  })

  t.is(subject.info.title, 'My awesome API')
})

test('initializeSpec provides a default title', t => {
  var subject = initializeSpec()

  t.is(typeof subject.info.title, 'string')
})

test('initializeSpec includes the provided version in info', t => {
  var subject = initializeSpec({
    version: 'some-version'
  })

  t.is(subject.info.version, 'some-version')
})

test('initializeSpec provides a default title', t => {
  var subject = initializeSpec()

  t.is(typeof subject.info.version, 'string')
})

test('initializeSpec returns an empty paths object', t => {
  var subject = initializeSpec()

  t.deepEqual(subject.paths, {})
})
