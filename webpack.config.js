const path = require('path');

module.exports = {
  entry: {
    popup: './src/popup/index.tsx',
    dashboard: './src/dashboard/index.tsx'
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name]/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  mode: 'development',
  devtool: 'cheap-module-source-map'
};