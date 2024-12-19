import { EOL } from 'os'

import type { LogData } from '../formatters/Formatter'
import { LogLevel, LogLevelValue } from '../util/constants'
import { Transport, type TransportOptions } from './Transport'

export class ConsoleTransport extends Transport<ConsoleTransportOptions> {
  /**
   * Creates a new console transport.
   * @param options
   */
  public constructor(options: ConsoleTransportOptions) {
    options = {
      eol: EOL,
      stderrMinLevel: LogLevel.WARN,
      ...options
    }

    super(options)
  }

  /**
   * Prints a formatted message to the console.
   * @param data The log data.
   * @param formatted The formatted message.
   */
  public print(data: LogData, formatted: string): void {
    const c = console as any
    if (
      LogLevelValue[data.level] > LogLevelValue[this.options.stderrMinLevel!]
    ) {
      if (c._stdout) {
        process.stdout.write(`${formatted}${this.options.eol}`)
      } else {
        console.log(formatted)
      }
    } else if (c._stderr) {
      process.stderr.write(`${formatted}${this.options.eol}`)
    } else console.error(formatted)

    return
  }
}

export interface ConsoleTransportOptions extends TransportOptions {
  eol?: string
  stderrMinLevel?: LogLevel
}
