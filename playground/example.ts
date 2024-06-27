import { Logger } from '../src'

const logger = new Logger('main')

logger.info('Hello, world!')
logger.warn('A new version of a is available: 3.0.1')
logger.silly('Project built!')
logger.trace('We are here now')
logger.debug('Fetched data')
logger.error(new Error('This is an example error. Everything is fine!'))

logger.info({ this: 'is', a: 'plain', javascript: 'object' })
logger.info([0, 1, 2, 3, 4], {
  user: {
    id: 123,
    name: 'Alice',
    profile: {
      age: 30,
      hobbies: ['reading', 'hiking', 'coding'],
      address: {
        street: '123 Maple St',
        city: 'Wonderland',
        zipCode: 0
      }
    }
  },
  settings: {
    theme: 'dark',
    notifications: {
      email: true,
      sms: false,
      'ack-id': 0,
      push: {
        enabled: true,
        frequency: 'daily'
      }
    }
  },
  stats: {
    posts: 45,
    followers: 300,
    engagement: {
      likes: 1230,
      comments: 240,
      shares: 85
    }
  }
})
