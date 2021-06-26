#!/usr/bin/env node
const fs = require('fs')
const { argv } = require('process')

const initial = () => {
  const config = {
    bot: {
      token: "机器人的token"
    },
    logger: {
      level: "INFO"
    },
    plugins: {}
  }
  fs.writeFileSync(`./config.json`, JSON.stringify(config, undefined, 2))
  console.log([
    '配置文件创建成功!',
    '请手动修改 config.json 后使用 npx khts start 启动程序',
    '如果有不懂的欢迎前往 https://kaihei.co/61zvJF 问我'
  ].join('\n'))
}

argv.forEach((value, index) => {
  if (value === 'init') {
    initial()
  } else if (value === 'help') {
    console.log([
      'kaiheila.ts',
      'khts init \t 初始化一个Bot',
      'khts start <配置文件> \t 启动Bot'
    ].join('\n'))
  } else if (value === 'start') {
    const App = require('kaiheila.ts')
    const config = JSON.parse(fs.readFileSync(argv[index + 1]).toString())
    new App.default(config)
  }
})