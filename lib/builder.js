const { createCanvas, registerFont, Image } = require('canvas')
const { parseString, Builder } = require('xml2js')
const { readFile, existsSync } = require('fs')
const { join, resolve } = require('path')
const { promisify } = require('util')
const Ajv = require('ajv')
const canvg = require('canvg')

const parseSVG = promisify(parseString)
const read = promisify(readFile)

const schema = require('./schema.json')

const ajv = new Ajv()
const validate = ajv.compile(schema)

module.exports = async function (config, cwd = process.cwd(), format = 'svg') {
  const valid = validate(config)

  if (!['png', 'pdf', 'svg'].includes(format)) {
    throw new Error(`invalid output format`)
  }

  if (!valid) {
    const error = new Error(`invalid config: ${validate.errors[0].message}`)
    error.errors = validate.errors
    throw error
  }

  const paths = {
    font: resolve(join(cwd, config.title.font.path)),
    icon: resolve(join(cwd, config.icon.path))
  }

  if (!existsSync(paths.font)) throw new Error('no font file found')
  if (!existsSync(paths.icon)) throw new Error('no icon file found')

  // default config values
  config.size.scale = config.size.scale || 0.2
  config.size.padding = config.size.padding || 25
  config.icon.color = config.icon.color || '#000000'
  config.title.font.color = config.title.font.color || '#000000'

  // calculate logo area
  const area = config.size.height * config.size.scale

  // load fonts
  registerFont(paths.font, { family: config.title.font.name })

  // init canvas
  const canvas = createCanvas(config.size.width, config.size.height, format)
  const ctx = canvas.getContext('2d')

  // is a background color provided?
  if (config.background) {
    ctx.fillStyle = config.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // load icon
  let svg = await read(paths.icon)

  // init image from icon
  const image = new Image()
  image.src = Buffer.from(svg)

  // calculate icon scale ratio
  const ratio = area / image.height

  // new icon dimentions
  const icon = {
    height: area,
    width: ratio * image.width
  }

  const SVGXML = await parseSVG(svg, { trim: true, normalize: true, normalizeTags: true })

  SVGXML.svg.$.height = icon.height
  SVGXML.svg.$.width = icon.width

  svg = new Builder().buildObject(SVGXML)

  // init font size
  const font = {
    size: 10,
    height: 0
  }

  // keep scaling the font until it matches the desired area size
  while (font.height < area) {
    ctx.font = `${font.size++}px ${config.title.font.name}`

    // calculate font height
    const metrics = ctx.measureText(config.title.text)
    font.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  }

  // draw font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = config.title.font.color
  ctx.fillText(config.title.text, config.size.width / 2 + icon.width / 2 + config.size.padding / 2, config.size.height / 2)

  // position image
  let coordinates = {
    x: (config.size.width / 2) - (icon.width / 2) - ctx.measureText(config.title.text).width / 2 - config.size.padding / 2,
    y: (config.size.height / 2) - (icon.height / 2)
  }

  ctx.fillStyle = config.icon.color

  // apply icon to canvas
  canvg(canvas, svg, {
    ImageClass: Image,
    ignoreMouse: true,
    ignoreAnimation: true,
    ignoreDimensions: true,
    ignoreClear: true,
    offsetX: coordinates.x,
    offsetY: coordinates.y
  })

  return canvas.toBuffer()
}
