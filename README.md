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
...
{
  loader: 'postcss-loader',
  plugins: [
    require('postcss-px-to-relative-unit')({
      // options
    })
  ]
}
...

//postcss.config.js  vue-cli3

···
module.exports = {
    plugins: {
        'postcss-px-to-relative-unit': {
            targetUnit: 'vw&rem',
            ignoreThreshold: 1,
            viewportWidth: 750,
            viewportHeight: 1334,
            htmlFontSize: 75,
            unitPrecision: 5,
            excludeFiles: [],
            excludeSelectors: [],
            excludeProperties: [],
            excludeVwProperties: [/^font-size$/]
        }, //注意顺序最好放到最后一个  防止cssnano滤掉属性
    },
};

···


```

## Options

```javascript
pxToUnit({
  targetUnit: 'vw',
  ignoreThreshold: 1,
  viewportWidth: 375,
  viewportHeight: 667,
  htmlFontSize: 37.5,
  unitPrecision: 5,
  excludeFiles: [],
  excludeSelectors: [],
  excludeProperties: [],
  excludeVwProperties:[],
})
```

| Options           | Default       | Description  |
| ----------------- |:-------------:|:-----|
| targetUnit        | 'vw' | target relative length unit. Support 'vw', 'rem' and 'vw&rem' |
| ignoreThreshold   | 1    | px values less than this threshold won't be converted |
| viewportWidth     | 750  | base viewport width (for targetUnit: 'vw' ) |
| viewportHeight    | 1334 | base viewport height (for targetUnit: 'vw', currently useless) |
| htmlFontSize      | 75   | base html font-size (for targetUnit: 'rem') |
| unitPrecision     | 5    | unit value precision |
| excludeFiles      | []   | exclude file path, support regexp. (example: [/node_modules/]) |
| excludeSelectors  | []   | exclude css selector, support string and regexp. (example: ['.ignore']) |
| excludeProperties | []   | exclude css properties, support string and regexp. (example: [/^width$/]) |
|excludeVwProperties| []   | 过滤不需要vw单位元素 可以使用字符串或者正则 (example: [/^font-size$/]) |

### targetUnit: 'vw&rem'

If you want to use unit vw and also worry about browser support, you can use 'vw&rem' mode. For example:

```css
// Input 
.hello {
    position: absolute;
    z-index: 2016;
    left: 0;
    right: 0;
    width: 710px;
    background-color: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    margin: 0 auto;
    padding: 40px 30px;
    box-sizing: border-box;
    transform: translateY(50%);
    font-size: 48px;
}

// Output
.hello {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    width: 9.46667rem;
    width: 94.66667vw;
    background-color: #fff;
    -webkit-box-shadow: 0 0.05333rem 0.10667rem 0 rgba(0,0,0,.08);
    -webkit-box-shadow: 0 0.53333vw 1.06667vw 0 rgba(0,0,0,.08);
    box-shadow: 0 0.05333rem 0.10667rem 0 rgba(0,0,0,.08);
    box-shadow: 0 0.53333vw 1.06667vw 0 rgba(0,0,0,.08);
    border-radius: 0.32rem;
    border-radius: 3.2vw;
    margin: 0 auto;
    padding: 0.53333rem 0.4rem;
    padding: 5.33333vw 4vw;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transform: translateY(50%);
    transform: translateY(50%);
    font-size: 0.64rem;
}
```

<!-- For browser doesn't support vw, it will automatically use rem to layout. -->

<!-- **Notice: If you need to limit max/min width of the layout, this mode is not suit for you** -->

### PX
Convert process is case sensitive, you could use PX in some edge case.
```css
// Input
.test {
  padding: 3.75PX 3.75px;
}

// Output
.test {
  padding: 3.75PX 1vw;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
