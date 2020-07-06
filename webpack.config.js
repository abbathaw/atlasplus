const path = require("path")
const OUTPUT_DIR = path.join(__dirname, "public/js/react")
const Dotenv = require("dotenv-webpack")

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    Studio: "./src/js/components/studio/Studio.js",
    GetStarted: "./src/js/components/admin/GetStarted.js",
    Configuration: "./src/js/components/admin/Configuration.js",
    VideoMacro: "./src/js/components/macro/VideoMacro.js",
    VideoMacroEditor: "./src/js/components/macro/VideoMacroEditor.js",
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
