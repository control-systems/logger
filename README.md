## `traceflow`

A lightweight, customizable logging library for TypeScript applications that
enhances logging for log-heavy apps like backends.

## Features

- Standarized formatting
- Supports multiple log levels (debug, info, warn, error, silly)
- Colorizes log messages based on log level
- Customizable colors and styles for log levels using `ColorKey`

## Usage

### Basic Usage

See ./playground/example.ts.

```ts
const logger = new Logger('main')

logger.info('Hello, world!')
logger.warn('A new version of a is available: 3.0.1')
logger.silly('Project built!')
logger.trace('We are here now')
logger.debug('Fetched data')
logger.error(new Error('This is an example error. Everything is fine!'))

logger.info({ this: 'is', a: 'plain', javascript: 'object' })
```

Copyright (c) 2024 taskylizard. CC0.
