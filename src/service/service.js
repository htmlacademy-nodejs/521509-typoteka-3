'use strict';

const chalk = require(`chalk`);

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCodes
} = require(`../consts`);

/**
 * Считываем аргументы от пользователя. Первые 2 аргумента - зарезервированы системой.
 * Начинаем с USER_ARGV_INDEX - по дифолту 3-го аргумента.
 */
const [command, ...args] = process.argv.slice(USER_ARGV_INDEX);

/**
 * Проверяем была ли введена команда и есть ли она в CLI.
 * Если пусто или нет в CLI показываем команду по дифолту - справку --help.
 */
if (!Cli[command]) {
  console.log(chalk.red(command ? `Команда ${command} не существует, смотри справку:` : `Команда не введена, смотри справку:`));
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCodes.SUCCESS);
}

/**
 * Запускаем соответствующий модуль и передаем ему аргументы
 */
Cli[command].run(...args);
