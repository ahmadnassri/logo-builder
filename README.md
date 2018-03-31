![](brand/logo.svg)

# Logo Builder [![version][npm-version]][npm-url] [![License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Downloads][npm-downloads]][npm-url] [![Coverage Status][codeclimate-coverage]][codeclimate-url]

> a simple logo spec builder

## Install

```bash
npm install --production --save logo-builder
```

## CLI

```plain
logo [config] <output>

Logo Builder

Positionals:
  config  path to logo config file
  output  path to logo output

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]https://schemas.bench.ci/environments/1.0.0/schema.json
```

## API

### builder(config, [cwd, format])

argument     | type     | required | default         | description                                                
------------ | -------- | -------- | --------------- | -----------------------------------------------------------
**`config`** | `Object` | ✔        | `-`             | [configuration object](#config)                            
**`cwd`**    | `String` | ✖        | `process.cwd()` | root path to search for font and icon files                
**`format`** | `enum`   | ✖        | `svg`           | desired output format, possible values: `svg`, `png`, `pdf`

```js
const builder = require('logo-builder')

const config = {
  size: {
    width: 500,
    height: 200
  },
  title: {
    text: "Logo Title",
    font: {
      name: "Roboto",
      path: "font.ttf"
    }
  },
  icon: {
    path: "icon.svg"
  }
}

logo(config, './logo/', 'svg'))
  .then(buffer => ...) // SVG buffer
  .catch(console.error)
```

### Configuration Object

###### Example

```js
{
  size: {
    width: 500,
    height: 200
  },
  title: {
    text: "Logo Title",
    font: {
      name: "Roboto",
      path: "font.ttf"
    }
  },
  icon: {
    path: "icon.svg"
  }
}
```

---

> License: [ISC][license-url] • 
> Copyright: [ahmadnassri.com](https://www.ahmadnassri.com) • 
> Github: [@ahmadnassri](https://github.com/ahmadnassri) • 
> Twitter: [@ahmadnassri](https://twitter.com/ahmadnassri)

[license-url]: http://choosealicense.com/licenses/isc/

[license-image]: https://img.shields.io/github/license/ahmadnassri/logo-builder.svg?style=flat-square

[travis-url]: https://travis-ci.org/ahmadnassri/logo-builder

[travis-image]: https://img.shields.io/travis/ahmadnassri/logo-builder.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/@ahmadnassri/logo-builder

[npm-version]: https://img.shields.io/npm/v/@ahmadnassri/logo-builder.svg?style=flat-square

[npm-downloads]: https://img.shields.io/npm/dm/@ahmadnassri/logo-builder.svg?style=flat-square

[codeclimate-url]: https://codeclimate.com/github/ahmadnassri/logo-builder

[codeclimate-coverage]: https://api.codeclimate.com/v1/badges/664ad54126ba642a42e0/test_coverage?style=flat-square
