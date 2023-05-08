const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// TODO: Add and configure workbox plugins for a service worker and manifest file. -- __ --
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: "development",
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    // generate HTML file with bundled JavaScript files
    plugins: [
      new HtmlWebpackPlugin({
        title: "Jate Text Editor",
        inject: "body",
        template: "./index.html",
      }),
      // generate manifest.json for the PWA
      new WebpackPwaManifest({
        name: "Jate Text Editor",
        short_name: "Jate",
        description: "A Progressive Web App Text Editor",
        background_color: "#ffffff",
        theme_color: "#000000",
        display: "standalone",
        start_url: ".",
        crossorigin: "use-credentials",
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      }),
      // inject service worker into the build
      new InjectManifest({
        swSrc: "./src-sw.js",
        swDest: "service-worker.js",
      }),
    ],

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // We use babel-loader in order to use ES6 and become reverse compatible
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/transform-runtime",
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
  };
};
