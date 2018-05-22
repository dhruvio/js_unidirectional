const loadTasks = require("load-grunt-tasks");
const requireDir = require("require-dir");
const _ = require("lodash");
const gruntConfigs = requireDir("./grunt-configs");
const gruntTasks = requireDir("./grunt-tasks");

module.exports = function (grunt) {
  //set up default options
  grunt.option.init({
    out: grunt.option("out") || "./build",
    example: grunt.option("example") || "hello-world",
    "front-end-port": grunt.option("front-end-port") || 3000,
    "front-end-host": grunt.option("front-end-host") || "127.0.0.1",
    "back-end-port": grunt.option("back-end-port") || 3001,
    "back-end-host": grunt.option("back-end-host") || "127.0.0.1"
  });
  //set up config object
  const src = () => `./doc/example/${grunt.option("example")}`;
  const out = () => grunt.option("out");
  const config = {
    dir: { src, out },
    src: {
      pkg: () => "./src",
      js: () => `${src()}/js`,
      "static": () => `${src()}/static`,
    },
    out: {
      js: () => `${out()}/app.js`
    },
    env: {
      frontEndPort: () => grunt.option("front-end-port"),
      frontEndHost: () => grunt.option("front-end-host"),
      backEndPort: () => grunt.option("back-end-port"),
      backEndHost: () => grunt.option("back-end-host")
    }
  };
  //log all config values
  _.forOwn(config, (v1, k1) => _.forOwn(v1, (v2, k2) => grunt.log.ok(`config.${k1}.${k2} ->`, v2())));
  //load grunt tasks from package.json
  loadTasks(grunt);
  //initialize the configs for various loaded tasks
  grunt.config.init(_.mapValues(gruntConfigs, c => c(grunt, config)));
  //set up entry-point tasks
  _.forOwn(gruntTasks, (subTasks, name) => grunt.registerTask(name, subTasks));
};
