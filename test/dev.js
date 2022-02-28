const fs = require("fs");
const path = require("path");

const postcss = require("postcss");
const pxToUnit = require("../index");

let inputFile = path.resolve(__dirname, "./input/test.css");

postcss([
  pxToUnit({
    targetUnit: "vw&rem",
  }),
])
  .process(fs.readFileSync(inputFile), {
    from: inputFile,
  })
  .then(function (result) {
    console.log(result.css);
  });
