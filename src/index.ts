import application from "classes/application";
import environment from "factories/environment";
import logger from 'factories/logger';
import { createHttpTerminator } from 'http-terminator';

const port = environment.addEnvironmentVariable({ environmentName: 'PORT', defaultValue: 3000, type: 'number' });

const server = application.start(port);
const httpTermination = createHttpTerminator({ server })

process.on('unhandledRejection', (error: Error, origin: string ) =>
  logger.log('error', `Unhandled Promise Rejection: ${error.message}`, { origin, stack: error.stack })
);

process.on('SIGTERM', () => {
  logger.log('info', 'SIGTERM')
  httpTermination.terminate();
});

process.on('SIGINT', () => {
  logger.log('info', 'SIGINT')
  httpTermination.terminate(); 
});

