import { readFileSync } from 'fs'
import log4js from 'log4js'
import { resolve } from 'path'
import { BotConfig } from '../app'

const config: BotConfig = JSON.parse(readFileSync(resolve('./config.json')).toString())

const conf: any = {
  appenders: {
    defaultFile: {
      type: 'dateFile',
      filename: 'logs/default',
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    },
    testFile: {
      type: 'dateFile',
      filename: 'logs/test',
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['defaultFile', 'console'],
      level: config.logger.level
    }
  }
}

log4js.configure(conf)

export default log4js.getLogger