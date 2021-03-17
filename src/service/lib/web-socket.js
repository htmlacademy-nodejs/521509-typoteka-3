'use strict';

const socket = require(`socket.io`);

const Logger = require(`../../lib/logger`);

class WebSocket {
  constructor(server) {
    this._logger = new Logger(`web-sockets`).getLogger();
    this._socket = socket(server, {
      cors: {
        origin: `${process.env.FRONT_SERVICE_DOMAIN_URL}:${process.env.FRONT_SERVICE_PORT}`
      }
    });

    this._init();
  }

  emit(eventName, param) {
    try {
      this._socket.emit(eventName, param);
    } catch (error) {
      this._logger.error(`Something wrong with socket.io, see info: ${error}`);
    }
  }

  _init() {
    this._socket.on(`connection`, (client) => {
      const {address: ip} = client.handshake;

      this._logger.info(`Новое подключение к WebSocket: ${ip}`);

      client.on(`disconnect`, () => {
        this._logger.info(`Клиент отключён: ${ip}`);
      });
    });
  }

  static getSocketsForTests() {
    return {
      emit() {}
    };
  }


}

module.exports = WebSocket;
