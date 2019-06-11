const postcss = require('postcss')

const pxUnitReg = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/g

function toFixed(number, precision) {
    let multiplier = Math.pow(10, precision + 1)
    let wholeNumber = Math.floor(number * multiplier)
    return Math.round(wholeNumber / 10) * 10 / multiplier
}

function isExcludeFile(path, excludeFiles) {
    return excludeFiles.some(rule => path.match(rule))
}

function isExcludeSelector(selector, excludeSelectors) {
    return excludeSelectors.some(rule => {
        if (typeof rule === 'string') {
            return selector.indexOf(rule) !== -1
        }
        return selector.match(rule)
    })
}

function isExcludeProperty(property, excludeProperties) {
    return excludeProperties.some(rule => {
        if (typeof rule === 'string') {
            return property.indexOf(rule) !== -1
        }
        return property.match(rule)
    })
}

module.exports = postcss.plugin('postcss-px-to-relative-unit', function(options) {
    options = options || {}
    options = Object.assign({
        targetUnit: 'vw',
        ignoreThreshold: 1,
        viewportWidth: 750,
        viewportHeight: 1334,
        htmlFontSize: 75,
        unitPrecision: 5,
        excludeFiles: [],
        excludeSelectors: [],
        excludeProperties: [],
        excludeVwProperties: [],
    }, options)
    return function(root) {
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
                let hasChange = false
                remValue = remValue.replace(pxUnitReg, (match, pxValue) => {
                    if (!pxValue) { return match }
                    let pixelValue = parseFloat(pxValue)
                    if (pixelValue <= options.ignoreThreshold) { return match }
                    let remTargetValue = toFixed(pixelValue / options.htmlFontSize, options.unitPrecision)
                    return `${remTargetValue}rem`
                })
                vwValue = vwValue.replace(pxUnitReg, (match, pxValue) => {
                    if (!pxValue) { return match }
                    let pixelValue = parseFloat(pxValue)
                    if (pixelValue <= options.ignoreThreshold) { return match }
                    hasChange = true
                    let vwTargetValue = toFixed(pixelValue / options.viewportWidth * 100, options.unitPrecision)
                    return `${vwTargetValue}vw`
                })
                if (!hasChange) { return }
                if (options.targetUnit === 'vw') {
                    decl.value = vwValue;
                } else if (options.targetUnit === 'rem') {
                    decl.value = remValue;
                } else if (options.targetUnit === 'vw&rem') {
                    decl.value = remValue;
                    //符合规则的元素不增加vw单位
                    !isExcludeProperty(decl.prop, options.excludeVwProperties) && decl.after({
                        prop: decl.prop,
                        value: vwValue
                    })
                }
            })
        })
    }
})