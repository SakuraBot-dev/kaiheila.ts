import log4js from 'log4js'

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
      level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO'
    }
  }
}

log4js.configure(conf)

export default log4js.getLogger