import { EventEmitter } from 'events';
import ws from './ws'
import Server from './api/server'
import Messages from './api/messages';
import Channel from './api/Channel';
import logger from '../logger'
import { Logger } from 'log4js'

declare interface Bot {
  on(event: 'open', listener: () => void): this;
  on(event: 'KMarkdown', listener: (msg: UserMessage) => void): this;
  on(event: 'FileMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'TextMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'ImageMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'VideoMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'AudioMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'CardMessage', listener: (msg: UserMessage) => void): this;
  on(event: 'SystemMessage', listener: (msg: SystemMessage) => void): this;
}

interface KaiheilaEvent {
  channel_type: string,
  type: number,
  target_id: string,
  author_id: string,
  content: string,
  msg_id: string,
  msg_timestamp: number,
  nonce: string,
  extra: any
}

interface User {
  id: string,
  username: string,
  identify_num: string,
  online: boolean,
  status: number,
  avatar: string,
  bot: boolean,
  mobile_verified: boolean,
  system: boolean,
  mobile_prefix: string,
  mobile: string,
  invited_count: number,
  nickname: string,
  roles: number[]
}

export interface UserMessage extends KaiheilaEvent {
  extra: {
    type: number,
    guild_id: string,
    channel_name: string,
    mention: string[],
    mention_all: boolean,
    mention_roles: string[],
    mention_here: boolean,
    author: User
  }
}

export interface SystemMessage extends KaiheilaEvent {
  extra: {
    type: string,
    body: any
  }
}

class Bot extends EventEmitter{
  private token: string
  private ws: ws

  public Server: Server
  public Messages: Messages
  public Channel: Channel
  public Logger: (category?: string) => Logger;

  constructor (token: string) {
    super()
    this.token = token
    this.ws = new ws(this.token)
    this.Server = new Server(this.token)
    this.Messages = new Messages(this.token)
    this.Channel = new Channel(this.token)
    this.Logger = logger

    this.ws.on('open', () => this.emit('open'))

    this.ws.on('message', msg => {
      if (msg.s === 0) {
        const data: KaiheilaEvent = msg.d
        if (data.type === 9) this.emit('KMarkdown', data)
        if (data.type === 4) this.emit('FileMessage', data)
        if (data.type === 1) this.emit('TextMessage', data)
        if (data.type === 2) this.emit('ImageMessage', data)
        if (data.type === 3) this.emit('VideoMessage', data)
        if (data.type === 8) this.emit('AudioMessage', data)
        if (data.type === 10) this.emit('CardMessage', data)
        if (data.type === 255) this.emit('SystemMessage', data)
      }
    })
  }
}

export default Bot