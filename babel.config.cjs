export const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  '@babel/preset-react',
  '@babel/preset-typescript',
];
export const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties',
];
export const env = {
  test: {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  },
  production: {
    plugins: [
      [
        'transform-react-remove-prop-types',
        '@emotion/babel-plugin',
        {
          removeImport: true,
        },
      ],
      '@babel/plugin-transform-react-inline-elements',
      '@babel/plugin-transform-react-constant-elements',
    ],
  },
};
