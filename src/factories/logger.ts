import path from 'path';
import winston, { createLogger, format, transports, Logger } from 'winston';
import environment from './environment';

const MEGABYTE = 1000000 as const;

// List of possible log levels as a readonly list
export const customList = [ 'fatal', 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'database', 'silly', 'setup' ] as const;
// Convert the readonly list of log levels to union type deceleration
type LogLevels = typeof customList[number];

type ChildLogger = {
  log: (level: LogLevels, message: string, data: any, ...args: any[]) => void
}

export type MethodLogger = ChildLogger;

export type ClassLogger = ChildLogger & {
  createMethodLogger: (methodName: string) => MethodLogger
}

export interface ILoggerConfigurations {
  levels: string[];
  transports: string[];
}

export class MyLogger {

  private instanceName: string = 'app';
  private logger: Logger;

  constructor() {
    const level = environment.addEnvironmentVariable({ environmentName: 'LOG_LEVEL', defaultValue: 'setup' });
    const env = environment.get('NODE_ENV');

    const transportList: any[] = [ new transports.Console({ level }) ]

    this.logger = createLogger({
      levels: this.generateLogLevels(Array.from(customList)),
      level,
      silent: env === 'test',
      format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf((info) => {
          const message = info.message;
          const timestamp = info.timestamp;

          delete (info as any).message;
          delete info.timestamp;

          info.instance = info.instance || this.instanceName;

          try {
            return `${timestamp} | ${info.level} | ${info.instance} | ${message} ${JSON.stringify(info)}`;
          } catch (err) {
            return `${timestamp} | ${info.level} | ${info.instance} | ${message} ${JSON.stringify({ error: err.message, stack: err.stack })}`
          }
        })
      ),
      transports: transportList
    });
  }

  log(level: LogLevels, message: string, data?: any) {
    this.logger.log(level, message, data);
  }

  database(message: string, data?: any) {
    this.log('database', message, data)
  }

  /**
   * Create a ClassLogger object which will contain a more detailed instance name
   * @param classNames List of class identifiers 
   * @returns A ClassLogger which can write a log with that class name OR create a method logger
   */
   public createClassLogger(...classNames: string[]): ClassLogger {
    const className = classNames.join('.');
    return {
      log: (level: LogLevels, message: string, data: any = {}, ...args: any[]) => {

        data.details = args;
        data.instance = `${className}.${this.instanceName}`;

        this.log(level, message, data);
      },
      createMethodLogger: (...methodNames: string[]): MethodLogger => {
        const methodName = methodNames.join('.');
        return {
          log: (level: LogLevels, message: string, data: any = {}, ...args: any[]) => {
            data.details = args;
            data.instance = `${methodName}.${className}.${this.instanceName}`;

            this.log(level, message, data);
          }
        }
      }
    }

  }

  /**
   * Get the loggers configured levels and transports
   * @returns Object containing a list of levels and transports
   */
   public getConfiguration(): ILoggerConfigurations {
    return {
      levels: Object.keys(this.logger.levels),
      transports: this.logger.transports.map((t: any) => t.name)
    };
  }

  /**
   * Update loggers level for one or more transports
   * @param {string} level The level to upgrade the transport(s) to.
   * @param {string} [transport] The transport to update.  When excluded all transports are updated
   */
   public updateLogLevel(level: string, transport: string = '') {
    if (!level) {
      throw new Error('Log level is required to update logs');
    }

    if (!this.logger.levels[level]) {
      throw new Error(`'${level}' is not a valid log level`);
    }

    if (transport) {
      const _transport = this.logger.transports.find((t: any) => t.name === transport)
      if (!_transport) {
        throw new Error(`'${transport}' is not a valid transport`);
      }

      _transport.level = level;
    } else {
      this.logger.transports.forEach((t: winston.transport) => {
        t.level = level;
      });
    }
  }

  private generateLogLevels(levels: string[]) {
    if (!Array.isArray(levels)) {
      throw new Error('Log levels must be a string array');
    }

    return levels.reduce( (acc, cur, index) => Object.assign(acc, { [cur]: index }), {}); 
  }
}

export default new MyLogger();
