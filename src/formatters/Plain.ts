import type { Logger } from "../Logger";
import type { Formatter, LogData } from "./Formatter";
import fecha from "../util/date";
import { isPlainObject } from "../util/inspect";
import { inspect } from "node:util";

export class PlainFormatter implements Formatter {
	/**
	 * The format to use when formatting timestamps.
	 */
	public dateFormat: string;

	/**
	 * Creates a new plain formatter.
	 * @param options
	 */
	public constructor(options: PlainFormatterOptions = {}) {
		this.dateFormat = options.dateFormat ?? "HH:mm:ss DD-MM-YYYY";
	}

	/**
	 * Formats a message without any color codes.
	 * @param data
	 * @param logger
	 */
	public format(data: LogData, logger: Logger): string {
		let str = "";
		if (data.timestamp) str += `[${this.formatTimestamp(data.timestamp)}] `;
		str += `[${data.level}] `;
		str += `[${process.pid}] `;
		str += `(${logger.name}`;
		if (data.name) str += `:${data.name}`;
		str += "): ";

		if (data.prefix) str += `${data.prefix} | `;
		str += this.formatMessage(data.input as unknown[]).trim();
		if (data.suffix) str += ` | ${data.suffix}`;

		return str;
	}

	/**
	 * Formats the timestamp of log.
	 * @param timestamp
	 */
	protected formatTimestamp(timestamp: number | Date | undefined): string {
		return fecha.format(new Date(timestamp ?? Date.now()), this.dateFormat);
	}

	/**
	 * Formats the log message without colors.
	 * @param input The log message to format.
	 */
	protected formatMessage(input: unknown[]): string {
		let msg = "";
		for (const data of input) {
			if (data instanceof Error) {
				msg += this.formatError(data);
				continue;
			} else if (isPlainObject(data) || Array.isArray(data)) {
				msg += `${JSON.stringify(data, null, 2)} `;
				continue;
			}

			msg += `${data} `;
		}

		return msg;
	}

	/**
	 * Formats an error without colors.
	 * @param error
	 */
	protected formatError(error: Error): string {
		return inspect(error, {
			colors: false,
			depth: null,
			showHidden: false,
		});
	}
}

export interface PlainFormatterOptions {
	dateFormat?: string;
}
