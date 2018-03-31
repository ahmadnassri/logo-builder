const { test } = require('tap')
const Ajv = require('ajv')

const config = require('./fixtures/config.json')
const schema = require('../lib/schema.json')

const ajv = new Ajv()

test('schema compiles successfully', assert => {
  assert.plan(2)

  assert.doesNotThrow(() => ajv.addSchema(schema))
  assert.type(ajv.compile(schema), 'function')
})

test('valid json file', assert => {
  assert.plan(1)

  assert.ok(ajv.validate(schema, config.valid.detailed))
})
