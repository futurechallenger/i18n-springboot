/**
 * Created by Uncle Charlie, 2017/06/29
 */

const path = require('path');
const Config = require('./config');

const PROJ_DIR = Config.project_dir;

const Constant = {
  CONTROLLER_DIR: PROJ_DIR + "main/java/com/mobike/athena/controller",
  RES_DIR: PROJ_DIR + "main/resources/i18n",
  KEYS_FILE_PATH: PROJ_DIR + "main/java/com/mobike/athena/util/MessageKeys.java",
  RES_NAME: "messages",
};

const Resources = {
  defaultMessageFile() {
    return path.join(Constant.RES_DIR, `${Constant.RES_NAME}.properties`);
  },

  langMessageFile(lang) {
    return path.join(Constant.RES_DIR, `${Constant.RES_NAME}_${lang}.properties`);
  }
};

module.exports = {
  Constant,
  Resources
};