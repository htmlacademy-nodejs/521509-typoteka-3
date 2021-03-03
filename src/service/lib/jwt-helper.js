'use strict';

const jwt = require(`jsonwebtoken`);

class JWTHelper {
  static generateTokens(tokenData) {
    const accessToken = jwt.sign({data: tokenData}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRATION});
    const refreshToken = jwt.sign({data: tokenData}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPERARION});
    return {accessToken, refreshToken};
  }

  static async refreshAccessToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, tokenData) => {
        if (err) {
          reject(err);
        }
        return resolve(this.generateTokens(tokenData.data));
      });
    });
  }

  static async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, tokenData) => {
        if (err) {
          reject(err);
        }
        resolve(tokenData.data);
      });
    }
    );
  }
}

module.exports = JWTHelper;
