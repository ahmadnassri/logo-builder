const { test } = require('tap')
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const fixtures = join(__dirname, 'fixtures')
const builder = require('../lib/builder')
const config = require(join(fixtures, 'config.json'))

test('fails on invalid config', assert => {
  assert.plan(1)
  assert.rejects(() => builder({}), { message: "should have required property 'size'" })
})

test('fails when files are not found', assert => {
  assert.plan(2)
  assert.rejects(() => builder(config.invalid.font, fixtures), { message: 'no font file found' })
  assert.rejects(() => builder(config.invalid.icon, fixtures), { message: 'no icon file found' })
})

test('fails when format is invalid', assert => {
  assert.plan(1)
  assert.rejects(() => builder(config.valid.minimal, fixtures, 'jpg'), { message: 'invalid output format' })
})

test('use default values', async assert => {
  const result = await builder(config.valid.minimal, fixtures)

  // writeFileSync(join(fixtures, 'results', 'minimal.svg'), result)

  assert.plan(1)
  assert.same(result, readFileSync(join(fixtures, 'results', 'minimal.svg')))
})

test('full example', async assert => {
  const result = await builder(config.valid.detailed, fixtures)

  // writeFileSync(join(fixtures, 'results', 'detailed.svg'), result)

  assert.plan(1)
  assert.same(result, readFileSync(join(fixtures, 'results', 'detailed.svg')))
})
