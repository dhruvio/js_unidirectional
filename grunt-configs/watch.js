module.exports = (grunt, config) => ({
  options: {
    interrupt: true,
    debounceDelay: 250
  },
  example: {
    files: [
      `${config.src.pkg()}/**`,
      `${config.src.js()}/**`,
      `${config.src.static()}/**`
    ],
    tasks: [
      "build-example"
    ]
  }
});
