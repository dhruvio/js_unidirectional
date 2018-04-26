module.exports = grunt => ({
  dev: {
    root: gruntConfig.dir.build,
    port: gruntConfig.env.frontEndPort,
    host: gruntConfig.env.frontEndHost,
    cache: 0,
    showDir: true,
    autoIndex: true,
    ext: "html",
    runInBackground: true,
    openBrowser: false
  }
});
