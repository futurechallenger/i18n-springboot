/**
 * Iterate Controller files in project.
 * 
 * Created by Uncle Charlie, 2017/06/27
 */
const util = require('util');
const fs = require('fs');
const path = require('path');

const Config = require('./config');
const LocalUtils = require('./utils');

// Constants
const readDirAsync = util.promisify(fs.readdir);
const fsState = util.promisify(fs.stat);


async function startParse(fileParser) {
  let files = await readFiles(LocalUtils.Constant.CONTROLLER_DIR);
  iterate(LocalUtils.Constant.CONTROLLER_DIR, files, fileParser);
}

async function readFiles(searchPath) {
  if (!searchPath || !fs.existsSync(searchPath)) {
    console.log(`path: ${searchPath} is invalid!`);
    return;
  }

  let files = await readDirAsync(searchPath);
  return files;
}

async function iterate(dir, files, fileParser) {
  if (!files) {
    console.log(`NO files found in this directory "${controllerDir}"`);
    return;
  }

  for (let file of files) {
    if (file.indexOf(".") == 0) {
      continue;
    }

    let filePath = path.join(dir, file);
    console.log(` path: ${filePath}`);

    let stats = await fsState(filePath);
    if (stats.isFile()) {
      //TODO: process fileconsole.log(`file path: ${filePath}`);
      fileParser(filePath);
    } else if (stats.isDirectory()) {
      console.log(`dir path: ${filePath}`);
      let files = await readDirAsync(filePath);
      iterate(filePath, files, fileParser);
    }
  };
}

module.exports = startParse;