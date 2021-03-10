
'use strict';

const path = require(`path`);

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

const {ID_LENGTH} = require(`../../consts`);
const {createDirIfNotExists} = require(`../../utils`);

class Uploader {
  constructor(folderName) {
    createDirIfNotExists(path.resolve(process.env.UPLOAD_FOLDER));
    this._uploadDirAbsolute = path.resolve(process.env.UPLOAD_FOLDER, folderName);
    this._storage = multer.diskStorage({
      destination: this._uploadDirAbsolute,
      filename: (req, file, cb) => {
        const uniqueName = nanoid(ID_LENGTH);
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
