module.exports = (grunt, config) => ({
  "static": {
    expand: true,
    cwd: config.src.static(),
    src: "**",
    dest: config.dir.out()
  }
});
