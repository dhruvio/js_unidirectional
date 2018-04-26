module.exports = grunt => ({
  build: {
    options: {
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
      `${gruntConfig.src.js}/index.js`
    ],
    dest: `${gruntConfig.out.js}`
  }
});
