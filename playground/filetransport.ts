import { FileTransport, Logger, PrettyFormatter } from "../src";

const fileTransport = new FileTransport({
	logDirectory: "./logs",
	filename: "app.log",
	maxSize: 5 * 1024 * 1024, // 5MB
	maxFiles: 3,
	compress: true,
	formatter: new PrettyFormatter({ colors: new Map() }),
});

const logger = new Logger("MyApp", {
	transports: [fileTransport],
});

for (let i = 0; i < 100; i++) {
	logger.info("Hello World");
}
