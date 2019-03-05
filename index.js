const postcss = require('postcss')

const pxUnitReg = /[\d.]+px/g
const pxValueReg = /[\d.]+/

function toFixed (number, precision) {
  let multiplier = Math.pow(10, precision + 1)
  let wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}

function isExcludeFile (path, excludeFiles) {
  return excludeFiles.some(rule => path.match(rule))
}

function isExcludeSelector (selector, excludeSelectors) {
  return excludeSelectors.some(rule => {
    if (typeof rule === 'string') {
      return selector.indexOf(rule) !== -1
    }
    return selector.match(rule)
  })
}

function isExcludeProperty (property, excludeProperties) {
  return excludeProperties.some(rule => {
    if (typeof rule === 'string') {
      return property.indexOf(rule) !== -1
    }
    return property.match(rule)
  })
}

module.exports = postcss.plugin('postcss-px-to-relative-unit', function (options) {
  options = options || {}
  options = Object.assign({
    targetUnit: 'vw',
    ignoreThreshold: 1,
    viewportWidth: 375,
    viewportHeight: 667,
    htmlFontSize: 37.5,
    unitPrecision: 5,
    excludeFiles: [],
    excludeSelectors: [],
    excludeProperties: []
  }, options)
  return function (root, result) {
    if (isExcludeFile(root.source.input.file, options.excludeFiles)) {
      return
    }
    root.walkRules(rule => {
      if (isExcludeSelector(rule.selector, options.excludeSelectors)) {
        return
      }
      rule.walkDecls(decl => {
        if (isExcludeProperty(decl.prop, options.excludeProperties)) {
          return
        }
        let remValue = decl.value
        let vwValue = decl.value
        let pxValues = decl.value.match(pxUnitReg)
        if (!pxValues) { return }
        let hasChange = false
        pxValues
          .map(pxValue => {
            let [ px ] = pxValue.match(pxValueReg)
            return {
              value: px * 1,
              origin: pxValue
            }
          })
          .filter(px => !isNaN(px.value) && px.value > options.ignoreThreshold)
          .sort((a, b) => b.value - a.value)
          .forEach(px => {
            hasChange = true
            let remTargetValue = toFixed(px.value / options.htmlFontSize, options.unitPrecision)
            let vwTargetValue = toFixed(px.value / options.viewportWidth * 100, options.unitPrecision)
            remValue = remValue.replace(px.origin, `${remTargetValue}rem`)
            vwValue = vwValue.replace(px.origin, `${vwTargetValue}vw`)
          })
        if (!hasChange) { return }
        if (options.targetUnit === 'vw') {
          decl.value = vwValue
        } else if (options.targetUnit === 'rem') {
          decl.value = remValue
        } else if (options.targetUnit === 'vw&rem') {
          decl.value = remValue
          decl.after({
            prop: decl.prop,
            value: vwValue
          })
        }
      })
    })
  }
})