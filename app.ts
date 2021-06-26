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

export default class {
  public client: robot
  public plugin: PluginManager

  constructor (config: BotConfig) {
    this.client = new robot(config.bot.token)
    this.plugin = new PluginManager(this.client, config)

    for (const item in config.plugins) {
      this.plugin.load(item)
    }
  }
}