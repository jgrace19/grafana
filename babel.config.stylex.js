module.exports = {
  presets: [
    ['@babel/preset-typescript', { allowDeclareFields: true, isTSX: true, allExtensions: true }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV !== 'production',
        runtimeInjection: true,
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
        useCSSLayers: true,
      },
    ],
  ],
};
