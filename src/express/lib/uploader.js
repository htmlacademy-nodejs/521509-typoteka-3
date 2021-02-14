
'use strict';

const path = require(`path`);

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

/**
 * Папка для загрузки
 * @type {string}
 */
const UPLOAD_DIR = `../../../upload/`;

class Uploader {
  constructor(folderName) {
    this._uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR, folderName);
    this._storage = multer.diskStorage({
      destination: this._uploadDirAbsolute,
      filename: (req, file, cb) => {
        const uniqueName = nanoid(10);
        const extension = file.originalname.split(`.`).pop();
        cb(null, `${uniqueName}.${extension}`);
      }
    });
  }

  getMiddleware() {
    return multer({
      storage: this._storage
    });
  }
}

module.exports = Uploader;
