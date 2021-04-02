module.exports = {
  runtimeCompiler: true,
  transpileDependencies: ['vuetify'],
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  outputDir: 'docs',
};
