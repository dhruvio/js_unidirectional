//set up global constants for all grunt tasks
const src = "./src";
const build = "./build";
global.gruntConfig = {
  dir: {
    src,
    build
  },
  src: {
    js: `${src}/js`,
    "static": `${src}/static`
  },
  out: {
    js: `${build}/app.js`
  },
  env: {
    frontEndPort: process.env.FRONT_END_PORT || 3000,
    frontEndHost: process.env.FRONT_END_HOSTNAME || "127.0.0.1",
    backEndPort: process.env.BACK_END_PORT || 3001,
    backEndHost: process.env.BACK_END_HOSTNAME || "127.0.0.1"
  }
};

//dependencies
const loadTasks = require("load-grunt-tasks");
const requireDir = require("require-dir");
const _ = require("lodash");
//grunt tasks
const config = requireDir("./grunt-configs");
const tasks = requireDir("./grunt-tasks");

module.exports = function (grunt) {
  //load grunt tasks from package.json
  loadTasks(grunt);
  //initialize the config for various loaded tasks
  grunt.config.init(_.mapValues(config, c => c(grunt)));
  //set up entry-point tasks
  _.forOwn(tasks, (subTasks, name) => grunt.registerTask(name, subTasks));
};
