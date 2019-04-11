const webpack = require('webpack');
const path = require('path');

const production = process.env.HEROKU || process.env.TRAVIS;

const config = {
  entry: {
    login: './src/js/login/app.js',
    room: './src/js/app.js',
    screen: './src/js/screen/app.js',
    whiteboard: './src/js/whiteboard/app.js',
  },
  node: {
    net: 'empty',
  },
  output: {
    path: './public/js/',
    filename: '[name].bundle.min.js',
    chunkFilename: '[id].chunk.min.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'raw' },
      // { test: /codemirror\/mode(?!.*(javascript|markdown)).*/, loader: 'null' }
    ],
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      filename: 'commons.min.js',
      name: 'commons',
    }),
  ],
};

if (production) {
  // Add in dedupe, uglify and babel for production
  config.plugins = config.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ]);
  config.module.loaders = config.module.loaders.concat([
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules(?!\/(opentok-textchat|opentok-camera-filters|filterous))/,
      query: {
        presets: ['babel-preset-env'].map(require.resolve),
      },
    },
  ]);
}

module.exports = config;
