import fs from "node:fs";
import path from "node:path";
import { Transport, type TransportOptions } from "./Transport";
import type { Formatter, LogData } from "../formatters/Formatter";
import { PlainFormatter } from "../formatters/Plain";
import { deepMerge } from "../util/inspect";

export interface FileTransportOptions extends TransportOptions {
	/**
	 * Directory to store log files
	 * @default logs/
	 */
	logDirectory?: string;

	/**
	 * Base filename for log files
	 * @default 'app.log'
	 */
	filename?: string;

	/**
	 * Maximum size of a log file in bytes before rotation
	 * @default 10MB
	 */
	maxSize?: number;

	/**
	 * Maximum number of log files to keep
	 * @default 5
	 */
	maxFiles?: number;

	/**
	 * Whether to compress rotated log files
	 * @default false
	 */
	compress?: boolean;

	/**
	 * The formatter to use for this transport
	 * @default PlainFormatter
	 */
	formatter: Formatter;
}

export class FileTransport extends Transport<FileTransportOptions> {
	private currentLogPath: string;

	constructor(
		options: FileTransportOptions = {
			formatter: new PlainFormatter(),
		},
	) {
		const defaultOptions: Partial<FileTransportOptions> = {
			logDirectory: "logs/",
			filename: "app.log",
			maxSize: 10 * 1024 * 1024, // 10MB
			maxFiles: 5,
			compress: false,
		};

		const mergedOptions: FileTransportOptions = deepMerge(
			options,
			defaultOptions,
		);
		// Ensure log directory exists
		if (!fs.existsSync(mergedOptions.logDirectory)) {
			fs.mkdirSync(mergedOptions.logDirectory, { recursive: true });
		}

		super(mergedOptions);

		this.currentLogPath = path.join(
			this.options.logDirectory,
			this.options.filename!,
		);
	}

	/**
	 * Print log message to file
	 * @param data Log data
	 * @param formatted Formatted log message
	 */
	public print(data: LogData, formatted: string): void {
		try {
			this.rotateLogsIfNeeded();
			fs.appendFileSync(this.currentLogPath, formatted + "\n");
		} catch (error) {
			console.error("Error writing to log file:", error);
		}
	}

	/**
	 * Rotate logs if current log file exceeds maximum size
	 */
	private rotateLogsIfNeeded(): void {
		try {
			if (fs.existsSync(this.currentLogPath)) {
				const stats = fs.statSync(this.currentLogPath);

				if (stats.size >= (this.options.maxSize ?? 10 * 1024 * 1024)) {
					this.rotateLogs();
				}
			}
		} catch (error) {
			console.error("Error checking log file size:", error);
		}
	}

	/**
	 * Perform log rotation
	 */
	private rotateLogs(): void {
		const maxFiles = this.options.maxFiles ?? 5;
		const logDirectory = this.options.logDirectory;
		const baseFilename = this.options.filename ?? "app.log";

		for (let i = maxFiles - 1; i > 0; i--) {
			const sourceFile = path.join(
				logDirectory,
				i === 1 ? baseFilename : `${baseFilename}.${i - 1}`,
			);
			const destFile = path.join(logDirectory, `${baseFilename}.${i}`);

			if (fs.existsSync(sourceFile)) {
				// If compress is true, compress older log files
				if (this.options.compress && i > 1) {
					this.compressFile(sourceFile, destFile + ".gz");
					fs.unlinkSync(sourceFile);
				} else {
					fs.renameSync(sourceFile, destFile);
				}
			}
		}

		fs.renameSync(
			this.currentLogPath,
			path.join(logDirectory, `${baseFilename}.1`),
		);
	}

	/**
	 * Compress a file using zlib
	 * @param sourcePath Path to source file
	 * @param destPath Path to compressed file
	 */
	private compressFile(sourcePath: string, destPath: string): void {
		const zlib = require("zlib");
		const input = fs.createReadStream(sourcePath);
		const output = fs.createWriteStream(destPath);
		const gzip = zlib.createGzip();

		input.pipe(gzip).pipe(output);
	}
}
