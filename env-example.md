Блок с базовой настройкой
```
# Общие настройки
NODE_ENV = DEVELOPMENT

LOG_FOLDER = ./logs/
LOG_LEVEL = debug
```

Блок с настройкой API сервера
```
# Настройки API сервера
## Порт по умолчанию
DEFAULT_API_PORT = 3000
API_PREFIX = /api
```

Блок с настройкой фронт сервера
```
# Настройки FRONT сервера
## Порт по умолчанию
FRONT_PORT_NUMBER = 8080
## Название папки для загрузок от пользователя
UPLOAD_FOLDER = upload

## Таймаут ожидания ответа от API
TIMEOUT = 1000;
## URL API сервера с префиксом
API_URL = http://localhost:3000/api
```
