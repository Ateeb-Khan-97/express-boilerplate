import moment from 'moment';
import chalk from 'chalk';

export class Logger {
  private readonly title: string;

  constructor(title: string) {
    this.title = title;
  }

  log(message: any, ...optionalParams: any[]) {
    if (typeof message != 'string' && typeof message != 'number') {
      message = JSON.stringify(message);
    }

    console.log(
      chalk.white(this.getTimestamp()),
      chalk.green('LOG'),
      chalk.yellow(`[${this.title}]`),
      chalk.green(message),
    );
  }

  error(message: any, ...optionalParams: any[]) {
    if (typeof message != 'string' && typeof message != 'number') {
      message = JSON.stringify(message);
    }

    console.log(
      chalk.white(this.getTimestamp()),
      chalk.red('ERR'),
      chalk.yellow(`[${this.title}]`),
      chalk.red(message),
    );
  }

  private getTimestamp() {
    return moment().format('DD/MM/YYYY, hh:mm:ss A');
  }
}
