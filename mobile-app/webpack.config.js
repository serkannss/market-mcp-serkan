const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.web.js',
  mode: 'development',
  devServer: {
    port: 3002,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/NativeEventEmitter': 'react-native-web/dist/exports/NativeEventEmitter',
      'react-native/Libraries/Components/StatusBar/StatusBar': 'react-native-web/dist/exports/StatusBar',
      // Vector icons için mock'lar
      'react-native-vector-icons/MaterialIcons': path.resolve(__dirname, 'src/mocks/MaterialIcons.js'),
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/mocks/MaterialCommunityIcons.js'),
      '@react-native-vector-icons/material-design-icons': path.resolve(__dirname, 'src/mocks/MaterialIcons.js'),
      '@expo/vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/mocks/MaterialCommunityIcons.js'),
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Market Fiyat Karşılaştırma',
    }),
  ],
}; 