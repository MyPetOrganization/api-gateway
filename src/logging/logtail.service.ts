import { Injectable, LoggerService } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { envs } from 'src/config';

/**
 * Service for logging on better stack.
 */
@Injectable()
export class LogginService implements LoggerService {
  private logtail: Logtail;

  constructor() {
    // Create a new logtail instance with the logtail token.
    this.logtail = new Logtail(envs.logtailToken);
  }

  /**
   * Get the current timestamp.
   * @returns The current timestamp.
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log a message.
   * @param message - The message to log. 
   */
  log(message: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'INFO');
  }

  error(message: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'ERROR');
  }

  warn(message: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'WARN');
  }

  debug(message: string,) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'DEBUG');
  }

  verbose(message: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'VERBOSE');
  }
}
