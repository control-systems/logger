import type { LogData } from '../formatters/Formatter'
import type { Logger } from '../Logger'
import { Transport, type TransportOptions } from './Transport'
import { LogLevel } from '../util/constants'

interface DiscordTransportOptions extends TransportOptions {
  /**
   * Discord webhook URL
   */
  webhookUrl: string

  /**
   * Optional custom username for the webhook
   */
  username?: string

  /**
   * Optional avatar URL for the webhook
   */
  avatarUrl?: string

  /**
   * Maximum length for message content
   */
  maxLength?: number
}

export class DiscordTransport extends Transport<DiscordTransportOptions> {
  /**
   * Creates a new Discord webhook transport
   * @param options Transport configuration
   */
  public constructor(options: DiscordTransportOptions) {
    if (!options.webhookUrl) {
      throw new Error('Discord webhook URL is required')
    }

    super({
      ...options,
      maxLength: options.maxLength ?? 2000
    })
  }

  /**
   * Implements the abstract print method
   * This method is typically used for synchronous logging,
   * but for webhooks, we'll use the async log method
   * @param data Log data
   * @param formatted Formatted message
   */
  public print(data: LogData, formatted: string): void {
    // For Discord, we'll silently do nothing in the sync print method
    return
  }

  /**
   * Send log message to Discord webhook
   * @param origin Logger instance
   * @param data Log data
   */
  public async log(origin: Logger, data: LogData): Promise<boolean> {
    // Check transport enabled status
    if (!this.enabled) return false
    else if (typeof this.enabled === 'function') {
      const v = await this.enabled()
      if (!v) return false
    }

    // Check log level
    if (LogLevel[data.level] > LogLevel[this.level]) return false

    // Format the message using the transport's formatter
    const formatted = await this.formatter.format(data, origin)

    try {
      const response = await this.sendWebhook(formatted, data)
      return response
    } catch (error) {
      console.error('Discord webhook transport error:', error)
      return false
    }
  }

  /**
   * Send message to Discord webhook
   * @param message Formatted log message
   * @param data Original log data
   */
  private async sendWebhook(message: string, data: LogData): Promise<boolean> {
    // Truncate message if it exceeds Discord's length limit
    const truncatedMessage = message.slice(0, this.options.maxLength)

    const payload: {
      content: string
      username?: string
      avatar_url?: string
      embeds?: any[]
    } = {
      content: truncatedMessage
    }

    if (this.options.username) {
      payload.username = this.options.username
    }
    if (this.options.avatarUrl) {
      payload.avatar_url = this.options.avatarUrl
    }

    if (data.extra) {
      payload.embeds = [
        {
          description: JSON.stringify(data.extra, null, 2),
          color: this.getLevelColor(data.level)
        }
      ]
    }

    const response = await fetch(this.options.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    return response.ok
  }

  /**
   * Convert log level to Discord embed color
   * @param level Log level
   */
  private getLevelColor(level: string): number {
    switch (level) {
      case LogLevel.ERROR:
        return 0xff0000 // Red
      case LogLevel.WARN:
        return 0xffa500 // Orange
      case LogLevel.INFO:
        return 0x1e90ff // Dodger Blue
      case LogLevel.DEBUG:
        return 0x808080 // Gray
      case LogLevel.TRACE:
        return 0x808080 // Gray
      case LogLevel.SILLY:
        return 0x808080 // Gray
      default:
        return 0x000000 // Black
    }
  }
}
