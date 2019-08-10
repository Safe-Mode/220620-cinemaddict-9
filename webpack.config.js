const path = require(`path`);

module.exports = {
  mode: `development`,
  context: path.join(__dirname, `src`),
  entry: `./main.js`,
  output: {
    path: path.join(__dirname, `public`),
    filename: `js/bundle.js`
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    open: true
  }
};
