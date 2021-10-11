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
    output: {
      filename: './geocimat/app.js',
    },
  },
  outputDir: 'geocimat',
  filenameHashing: false,
};
