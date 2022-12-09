module.exports = {
  entry: {
    dev: "./src/index.js",
  },
  output: {
    filename: "./build/index.tsx",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    loaders: [
      // Typescript
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
};