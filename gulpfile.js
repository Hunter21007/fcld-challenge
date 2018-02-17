/* jshint strict:true */
/* jshint esversion: 6 */
/* jshint node: true */

"use strict";

let gulp = require("gulp");
let yargs = require("yargs");
let fs = require("fs");

let argv = yargs
  .alias("c", "commit")
  .describe("c")
  .string("c")
  .default("")
  .help("info").argv;

gulp.task("post-build", ["copy-files"]);

gulp.task("copy-files", ["write-appinfo"], function() {
  return gulp
    .src(["src/**/*.json", "src/**/*.gql", "src/**/*.hbs", "package*.json"])
    .pipe(gulp.dest("build/"));
});

gulp.task("write-appinfo", done => {
  let defFilePath = "./src/config/default.json";
  let pkgdata = require("./package.json");
  let config = require(defFilePath);
  config.appInfo = config.appInfo || {};
  config.appInfo.name = pkgdata.name;
  config.appInfo.version = pkgdata.version;
  console.info("Writing Commit info: " + (process.env.CI_COMMIT_SHA || "<none>"));
  if (process.env.CI_COMMIT_SHA != null) {
    config.appInfo.commit = process.env.CI_COMMIT_SHA.substr(0, 8);
  } else {
    config.appInfo.commit = undefined;
  }
  config.appInfo.date = new Date(Date.now()).toISOString();
  fs.writeFileSync(defFilePath, JSON.stringify(config, null, 2));
  done();
});