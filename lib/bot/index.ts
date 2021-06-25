import { EventEmitter } from 'events';
import ws from './ws'
import Server, { Role } from './api/server'
import Messages from './api/messages';
import Channel, { Channel as typeChannel} from './api/Channel';
import logger from '../logger'
import { Logger } from 'log4js'

declare interface Bot {
  on(event: 'open', listener: () => void): this;
  on(event: 'kmarkdown', listener: (msg: UserMessage) => void): this;
  on(event: 'file_message', listener: (msg: UserMessage) => void): this;
  on(event: 'text_message', listener: (msg: UserMessage) => void): this;
  on(event: 'image_message', listener: (msg: UserMessage) => void): this;
  on(event: 'video_message', listener: (msg: UserMessage) => void): this;
  on(event: 'audio_message', listener: (msg: UserMessage) => void): this;
  on(event: 'card_message', listener: (msg: UserMessage) => void): this;
  on(event: 'system_message', listener: (msg: SystemMessage) => void): this;
  on(event: 'add_reaction', listener: (msg: addReaction) => void): this;
  on(event: 'delete_reaction', listener: (msg: deleteReaction) => void): this;
  on(event: 'update_message', listener: (msg: updateMessage) => void): this;
  on(event: 'delete_message', listener: (msg: deleteMessage) => void): this;
  on(event: 'added_channel', listener: (msg: typeChannel) => void): this;
  on(event: 'updated_channel', listener: (msg: typeChannel) => void): this;
  on(event: 'delete_channel', listener: (msg: deleteChannel) => void): this;
  on(event: 'pinned_message', listener: (msg: pinMessage) => void): this;
  on(event: 'unpinned_message', listener: (msg: unpinMessage) => void): this;
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
  extra: {
    type: string,
    body: any
  } | any
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

export interface addReaction {
  channel_id: string,
  emoji: {
    id: string,
    name: string,
  },
  user_id: string,
  msg_id: string
}

export interface deleteReaction {
  channel_id: string,
  emoji: {
    id: string,
    name: string,
  },
  user_id: string,
  msg_id: string
}

export interface updateMessage {
  channel_id: string,
  content: string,
  mention: string[],
  mention_all: boolean,
  mention_here: boolean,
  mention_roles: Role[],
  updated_at: number,
  msg_id: string
}

export interface deleteMessage {
  channel_id: string,
  msg_id: string
}

export interface deleteChannel {
  id: string,
  delete_at: number
}

export interface unpinMessage {
  channel_id: string,
  operator_id: string,
  msg_id: string
}

export interface pinMessage {
  channel_id: string,
  operator_id: string,
  msg_id: string
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
        if (data.type === 9) this.emit('kmarkdown', data)
        if (data.type === 4) this.emit('file_message', data)
        if (data.type === 1) this.emit('text_message', data)
        if (data.type === 2) this.emit('image_message', data)
        if (data.type === 3) this.emit('video_message', data)
        if (data.type === 8) this.emit('audio_message', data)
        if (data.type === 10) this.emit('card_message', data)
        
        if (data.type === 255) {
          this.emit('SystemMessage', data)
          this.emit(data.extra.type, data.extra.body)
        }
      }
    })
  }
}

export default Bot