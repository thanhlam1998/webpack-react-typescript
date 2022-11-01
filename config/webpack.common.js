const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const paths = require("./paths");

const ctx = {
  isEnvDevelopment: process.env.NODE_ENV === "development",
  isEnvProduction: process.env.NODE_ENV === "production",
};

const { isEnvDevelopment, isEnvProduction } = ctx;

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    filename: ctx.isEnvProduction
      ? "[name].[contenthash].bundle.js"
      : "[name].bundle.js",
    path: paths.appDist,
    clean: true,
  },
  resolve: {
    alias: {
      "@": paths.appSrc,
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: ["node_modules", paths.appSrc],
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2015",
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [paths.appSrc],
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: [paths.appSrc],
        type: "asset/resource",
      },
      {
        test: /.(scss|sass)$/,
        include: paths.appSrc,
        use: [
          "style-loader",
          isEnvProduction && MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
//             options: { 
//               modules: true, // Use this if you want to use module css
//               importLoaders: 2,
//             },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          "sass-loader",
        ].filter(Boolean),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "release_v0",
    }),
    new ProgressBarPlugin({
      format: "  :msg [:bar] :percent (:elapsed s)",
    }),
  ],
};
