module.exports = {
  presets: [
    ['module:@react-native/babel-preset', {jsxImportSource: 'nativewind'}],
  ],
  plugins: [
    require('react-native-css-interop/dist/babel-plugin').default,
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'react-native-css-interop',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
