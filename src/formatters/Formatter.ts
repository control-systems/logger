import type { LogConfigData, Logger } from '../Logger'
import type { LogLevel } from '../util/constants'

export interface Formatter {
  /**
   * Formats a message.
   * @param data Data from the logger.
   * @param logger The logger the message came from.
   */
  format(data: LogData, logger: Logger): string | Promise<string>
}

export interface LogData extends LogConfigData {
  level: LogLevel
}
