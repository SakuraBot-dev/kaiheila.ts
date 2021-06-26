import { BotConfig } from '../app'
import client, { UserMessage } from './bot'
import logger from './logger'
import path from 'path'
import { existsSync } from 'fs'
import { Logger } from 'log4js'
import CardBuilder from './bot/CardBuilder'

export interface ctx{
  bot: client,
  command: (regexp: RegExp, cmd: string, helper: string, callback: (match: RegExpExecArray, event: UserMessage, reply: (type: number, msg: string | CardBuilder  | CardBuilder[]) => void) => void) => void,
  config: any,
  logger: Logger
}

export default class PluginManager {
  private ctx: ctx
  private config: BotConfig
  private commands: {
    name: string,
    value: string
  }[]
  private plugins: {
    [index: string]: any
  }

  constructor (bot: client, config: BotConfig) {
    this.config = config
    this.plugins = {}
    this.commands = []
    
    const command = (regexp: RegExp, cmd: string, helper: string, callback: (match: RegExpExecArray, event: UserMessage, reply: (type: number, msg: string | CardBuilder  | CardBuilder[]) => void) => void) => {
      this.commands.push({
        name: cmd,
        value: helper
      })
      
      bot.on('text_message', msg => {
        regexp.lastIndex = 0
        if (regexp.test(msg.content)) {
          const reply = (type: number, message: string | CardBuilder  | CardBuilder[]) => {
            bot.Messages.sendMessage({
              type: type,
              target_id: msg.target_id,
              content: message
            })
          }

          regexp.lastIndex = 0
          const match = regexp.exec(msg.content)
          if (match) callback(match, msg, reply)
        }
      })
    }

    command(/^\/help$/, '/help', '查看帮助信息', (match, event, reply) => {
      const card = bot.getCardBuilder()
      card.addImageAndText({
        text: event.extra.author.nickname,
        mode: 'left',
        image: event.extra.author.avatar,
        size: 'sm',
        circle: true
      })
      card.addTitle('Help: ')
      card.addSeparator()
      card.addRowFields(2, this.commands)
      reply(10, card)
    })

    this.ctx = {
      config: {},
      logger: logger(),
      bot: bot,
      command: command
    }
  }

  async load (plugin: string) {
    try {
      let realPath = plugin

      if (existsSync(path.resolve(realPath))) realPath = path.resolve(realPath)

      logger('Plugin').info(`正在加载 ${plugin}`)
      
      const copyCtx = { ...this.ctx }
      
      copyCtx.config = this.config.plugins[plugin]
      copyCtx.logger = logger(plugin)
      
      this.plugins[plugin] = await import(realPath)

      typeof this.plugins[plugin] === 'function' ? this.plugins[plugin](copyCtx) : this.plugins[plugin].default(copyCtx)
      
      logger('Plugin').info(`${plugin} 加载完成`)
    } catch (error) {
      logger('Plugin').warn(`${plugin} 加载失败`, error)
    }
  }
}
