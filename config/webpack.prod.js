// @ts-nocheck
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./webpack.common");
const purgeCSSPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
const paths = require("./paths");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "[hash].[name].css",
    }),
    new purgeCSSPlugin({
      paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
    }),
  ],
  optimization: {
    runtimeChunk: true,
    moduleIds: "deterministic",
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    splitChunks: {
      // include all type of chunks
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10,
          enforce: true,
        },
      },
    },
  },
});
