# postcss-px-to-relative-unit

[![npm version](https://badge.fury.io/js/postcss-px-to-relative-unit.svg)](https://badge.fury.io/js/postcss-px-to-relative-unit)
[![Build Status](https://travis-ci.org/pandaGao/postcss-px-to-relative-unit.svg?branch=master)](https://travis-ci.org/pandaGao/postcss-px-to-relative-unit)

A Postcss plugin to convert px to relative length units (vw / rem)

## Install

```shell
npm install postcss-px-to-relative-unit
```

## Usage

```javascript
// webpack.config.js
const pxToUnit = require('postcss-px-to-relative-unit')

...
{
  loader: 'postcss-loader',
  plugins: [
    pxToUnit({
      // options
    })
  ]
}
...
```

## Options

```javascript
pxToUnit({
  targetUnit: "vw",
  ignoreThreshold: 1,
  viewportWidth: 375,
  viewportHeight: 667,
  htmlFontSize: 37.5,
  unitPrecision: 5,
  excludeFiles: [],
  excludeSelectors: [],
  excludeProperties: [],
});
```

| Options           | Default | Description                                                               |
| ----------------- | :-----: | :------------------------------------------------------------------------ |
| targetUnit        |  'vw'   | target relative length unit. Support 'vw', 'rem' and 'vw&rem'             |
| ignoreThreshold   |    1    | px values less than this threshold won't be converted                     |
| viewportWidth     |   375   | base viewport width (for targetUnit: 'vw' )                               |
| viewportHeight    |   667   | base viewport height (for targetUnit: 'vw', currently useless)            |
| htmlFontSize      |  37.5   | base html font-size (for targetUnit: 'rem')                               |
| unitPrecision     |    5    | unit value precision                                                      |
| excludeFiles      |   []    | exclude file path, support regexp. (example: [/node_modules/])            |
| excludeSelectors  |   []    | exclude css selector, support string and regexp. (example: ['.ignore'])   |
| excludeProperties |   []    | exclude css properties, support string and regexp. (example: [/^width$/]) |

### targetUnit: 'vw&rem'

If you want to use unit vw and also worry about browser support, you can use 'vw&rem' mode. For example:

```css
// Input
.test {
  border: 3.75px solid #fff;
}

// Output
.test {
  border: 0.1rem solid #fff;
  border: 1vw solid #fff;
}
```

For browser doesn't support vw, it will automatically use rem to layout.

**Notice: If you need to limit max/min width of the layout, this mode is not suit for you**

### PX

Convert process is case sensitive, you could use PX in some edge case.

```css
// Input
.test {
  padding: 3.75px 3.75px;
}

// Output
.test {
  padding: 3.75px 1vw;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
