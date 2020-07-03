const path = require("path")
const OUTPUT_DIR = path.join(__dirname, "public/js/react")

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    Studio: "./src/js/client/Studio.jsx",
    GetStarted: "./src/js/components/admin/GetStarted.jsx",
    Configuration: "./src/js/components/admin/Configuration.jsx",
    VideoMacro: "./src/js/components/macro/VideoMacro.jsx",
    VideoMacroEditor: "./src/js/components/macro/VideoMacroEditor.jsx",
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
}
