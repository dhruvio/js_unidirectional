module.exports = (grunt, config) => ({
  build: {
    options: {
      browserifyOptions: {
        debug: true,
        basedir: config.src.js(),
        paths: [
          "../../../../node_modules",
          "../../../../"
        ],
      },
      transform: [
        [
          "babelify",
          {
            presets: [
              "env",
              "react"
            ]
          }
        ]
      ]
    },
    src: [
      `${config.src.js()}/index.js`
    ],
    dest: config.out.js()
  }
});
