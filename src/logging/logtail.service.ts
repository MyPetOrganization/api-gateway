import { Injectable, LoggerService } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { envs } from 'src/config';

@Injectable()
export class LogginService implements LoggerService {
  private logtail: Logtail;

  constructor() {
    this.logtail = new Logtail(envs.logtailToken);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  log(message: string, ip?: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'INFO');
  }

  error(message: string, trace: string, ip?: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'ERROR', { trace });
  }

  warn(message: string, ip?: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'WARN');
  }

  debug(message: string, ip?: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'DEBUG');
  }

  verbose(message: string, ip?: string) {
    this.logtail.log(`${this.getCurrentTimestamp()} - ${message}`, 'VERBOSE');
  }
}
