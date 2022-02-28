const fs = require("fs");
const path = require("path");

const postcss = require("postcss");
const pxToUnit = require("../index");

function runCase(input, output, options) {
  let inputFile = fs.readFileSync(input);
  let outputFile = fs.readFileSync(output, "utf8");
  return postcss([pxToUnit(options)])
    .process(inputFile, {
      from: input,
    })
    .then(function (result) {
      expect(result.css).toEqual(outputFile);
      expect(result.warnings()).toHaveLength(0);
    });
}

describe("Convert", () => {
  test("px to rem", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./output/rem.css");
    return runCase(inputFile, outputFile, {
      targetUnit: "rem",
    });
  });

  test("px to vw", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./output/vw.css");
    return runCase(inputFile, outputFile);
  });

  test("px to vw&rem", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./output/vw&rem.css");
    return runCase(inputFile, outputFile, {
      targetUnit: "vw&rem",
    });
  });

  test("ignore threshold", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./output/ignore.css");
    return runCase(inputFile, outputFile, {
      targetUnit: "rem",
      ignoreThreshold: 5,
    });
  });

  test("ignore pattern", () => {
    let inputFile = path.resolve(__dirname, "./input/ignore-pattern.css");
    let outputFile = path.resolve(__dirname, "./input/ignore-pattern.css");
    return runCase(inputFile, outputFile);
  });
});

describe("Exclude rules", () => {
  test("exclude file", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./input/test.css");
    return runCase(inputFile, outputFile, {
      excludeFiles: [/test/],
    });
  });

  test("exclude selector (regexp)", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./input/test.css");
    return runCase(inputFile, outputFile, {
      excludeSelectors: [/test/],
    });
  });

  test("exclude selector (string)", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./input/test.css");
    return runCase(inputFile, outputFile, {
      excludeSelectors: ["test"],
    });
  });

  test("exclude property (regexp)", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(__dirname, "./output/exclude-property.css");
    return runCase(inputFile, outputFile, {
      excludeProperties: [/^width$/],
    });
  });

  test("exclude property (string)", () => {
    let inputFile = path.resolve(__dirname, "./input/test.css");
    let outputFile = path.resolve(
      __dirname,
      "./output/exclude-property-string.css"
    );
    return runCase(inputFile, outputFile, {
      excludeProperties: ["width"],
    });
  });
});
