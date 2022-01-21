// @ts-nocheck
const { merge } = require("webpack-merge");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const common = require("./webpack.common");

const smp = new SpeedMeasurePlugin();

const isNeedSpeed = true;

const config = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
    hot: true,
  },
  devtool: "eval-cheap-module-source-map",
  cache: {
    type: "filesystem",
  },
});

module.exports = isNeedSpeed ? smp.wrap(config) : config;
