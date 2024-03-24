import type { LogData } from './formatters/Formatter'
import { PrettyFormatter } from './formatters/Pretty'
import { ConsoleTransport } from './transports/ConsoleTransport'
import type { Transport, TransportOptions } from './transports/Transport'
import { LogLevel } from './util/constants'

const ConfigSymbol = Symbol('LOG_CONFIG_SYMBOL')

export const config = (data: LogConfigData): LogConfigData => ({
  ...data,
  [ConfigSymbol]: true
})

export interface LogConfigData {
  timestamp?: Date | number | false
  prefix?: string
  extra?: unknown
  input?: unknown[]
  suffix?: string
  // Name of the log.
  name?: string
  [ConfigSymbol]?: true
}

export interface LoggerOptions {
  transports?: Transport<TransportOptions>[]
  defaults?: LogConfigData
  levels?: LogLevel[]
}

export class Logger {
  /**
   * The name of the logger.
   */
  public readonly name: string

  /**
   * Transports to use.
   */
  public transports: Transport<TransportOptions>[]

  /**
   * Default log data values.
   */
  public defaults?: LogConfigData

  /**
   * Creates a new logger.
   * @param name
   * @param options
   */
  public constructor(name: string, options: LoggerOptions = {}) {
    this.name = name
    this.defaults = options.defaults
    this.transports = options.transports ?? [
      new ConsoleTransport({
        formatter: new PrettyFormatter(),
        level: LogLevel.TRACE
      })
    ]
  }

  /**
   * Creates a new info log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public info(config: LogConfigData, ...input: unknown[]): LogData

  /**
   * Creates a new info log.
   * @param input The message to log out.
   */
  public info(...input: unknown[]): LogData
  public info(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.INFO, timestamp: Date.now() })
  }

  /**
   * Creates a new debug log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public debug(config: LogConfigData, ...input: string[]): LogData

  /**
   * Creates a new debug log.
   * @param input The message to log out.
   */
  public debug(...input: string[]): LogData
  public debug(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.DEBUG, timestamp: Date.now() })
  }

  /**
   * Creates a new error log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public error(config: LogConfigData, ...input: unknown[]): LogData

  /**
   * Creates a new error log.
   * @param input The message to log out.
   */
  public error(...input: unknown[]): LogData
  public error(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.ERROR, timestamp: Date.now() })
  }

  /**
   * Creates a new warn log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public warn(config: LogConfigData, ...input: unknown[]): LogData

  /**
   * Creates a new warn log.
   * @param input The message to log out.
   */
  public warn(...input: unknown[]): LogData
  public warn(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.WARN, timestamp: Date.now() })
  }

  /**
   * Creates a new trace log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public trace(config: LogConfigData, ...input: unknown[]): LogData

  /**
   * Creates a new trace log.
   * @param input The message to log out.
   */
  public trace(...input: unknown[]): LogData
  public trace(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.TRACE, timestamp: Date.now() })
  }

  /**
   * Creates a new silly log.
   * @param config Configuration for this log.
   * @param input The message
   */
  public silly(config: LogConfigData, ...input: unknown[]): LogData

  /**
   * Creates a new silly log.
   * @param input The message to log out.
   */
  public silly(...input: unknown[]): LogData
  public silly(...input: unknown[]): LogData {
    return this._log(input, { level: LogLevel.SILLY, timestamp: Date.now() })
  }

  private _log(input: unknown[], data: Omit<LogData, 'input'>): LogData {
    let config: LogData =
      // @ts-ignore
      typeof input[0] === 'object' && input[0][ConfigSymbol]
        ? { ...data, ...(input.shift() as LogData) }
        : data

    if (this.defaults) {
      config = Object.assign(config, this.defaults)
    }

    config.input = input
    for (const transport of this.transports)
      setImmediate(() => transport.log(this, config))

    return config
  }
}
