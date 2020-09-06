module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    path: `${__dirname}/dist`,
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
