import { readFileSync } from 'fs'
import robot from './lib/bot'
import PluginManager from './lib/plugin'

export interface BotConfig {
  bot: {
    token: string
  },
  logger: {
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  }
  plugins: {
    [index: string]: any
  }
}

const config: BotConfig = JSON.parse(readFileSync('./config.json').toString())

const client = new robot(config.bot.token)
const plugin = new PluginManager(client, config)

for (const item in config.plugins) {
  plugin.load(item)
}
