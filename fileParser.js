/**
 * Parse a controller.
 * 
 * Created by Uncle Charlie, 2017/06/27
 */

const fs = require('fs');
const util = require('util');
const path = require('path');
const readline = require('readline');

const Utils = require('./utils');
const Config = require('./config');

const readFileAsync = util.promisify(fs.readFile);
const appendAsync = util.promisify(fs.appendFile);
const writeFileAsync = util.promisify(fs.writeFile);

const START_STR = '.setMessage("';
const KEYS_FILE = Utils.Constant.KEYS_FILE_PATH;

async function parseFile(filePath) {
  let fileData = await readFileAsync(filePath, 'utf8');
  let keyIndex = 0;

  const baseName = path.basename(path.parse(filePath).dir);
  const fileName = path.parse(filePath).name;
  console.log(`basename ${baseName}`);

  let contentLines = fileData.toString().split('\n');

  if (!contentLines || !Array.isArray(contentLines) || contentLines.length <= 0) {
    console.log(`file content is empty`);
    return;
  }

  i18nContent = contentLines.map((line, lineNum) => {
    if (!line) {
      return line;
    }

    let startIndex = line.indexOf(START_STR);
    if (startIndex == -1) {
      return line;
    }

    console.log(`Original string: ${line}`);
    let endIndex = line.indexOf('")');
    if(endIndex == -1) {
      // In this situation, the "MESSAGE" is not jus a string, it maybe a statement.
      endIndex = line.indexOf(`);`);
    }
    let rawString = line.substring(startIndex + START_STR.length, endIndex);

    console.log(`raw string - ${rawString}`);

    let resKey = `msg.${baseName}.${fileName.replace('Controller', '').toLowerCase()}.${lineNum}`;
    writeContent(resKey, rawString);

    let pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
    if (pattern.exec(rawString)) {
      console.log('中文');
    } else {
      console.log('English');
    }

    let msgKey = resKey.split('.').join('_').toUpperCase();
    return line.replace(`"${rawString}"`, `msg.getMessage(MessageKeys.${msgKey})`);
  });

  writeFileAsync(filePath, i18nContent.join('\n'));
}

/**
 * 
 * @param {*} key `msg.${dir_name}.${file_name}.${index}`.
 * @param {*} rawString String that to be translated.
 */
function writeContent(key, rawString) {
  let keyString = resKey2MsgKey(key);
  appendAsync(KEYS_FILE, keyString);

  let defaultFile = Utils.Resources.defaultMessageFile();
  let otherFiles = ((lang) => {
    if (!lang) {
      throw new Error(`INVALID LANG PARAMETER`);
    }

    let filePaths = lang.map((val) => {
      return Utils.Resources.langMessageFile(val);
    })

    return filePaths;
  })(Config.lang)

  let res = `${key} = ${rawString}; \n`;
  appendAsync(defaultFile, res);
  otherFiles.forEach((val) => {
    appendAsync(val, res);
  })
}

function resKey2MsgKey(key) {
  let paramName = key.split('.').join('_').toUpperCase();
  let keyString = `public static final String ${paramName} = "${key}"; \n`;
  return keyString;
}

module.exports = parseFile;