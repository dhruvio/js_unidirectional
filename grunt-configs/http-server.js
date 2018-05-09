module.exports = (grunt, config) => ({
  dev: {
    root: config.dir.out(),
    port: config.env.frontEndPort(),
    host: config.env.frontEndHost(),
    cache: 0,
    showDir: true,
    autoIndex: true,
    ext: "html",
    runInBackground: true,
    openBrowser: false
  }
});
