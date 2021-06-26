import ws from './ws'
import { EventEmitter } from 'events'
import Server, { Role as TypeRole } from './api/server'
import Messages from './api/messages'
import Channel, { Channel as typeChannel} from './api/channels'
import PrivateChat from './api/private_chat'
import PirvateMessage from './api/private_message'
import Asset from './api/asset'
import Role from './api/role'
import CardBuilder from './CardBuilder'
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
  on(event: 'add_reaction', listener: (msg: add_reaction) => void): this;
  on(event: 'delete_reaction', listener: (msg: delete_reaction) => void): this;
  on(event: 'update_message', listener: (msg: update_message) => void): this;
  on(event: 'delete_message', listener: (msg: delete_message) => void): this;
  on(event: 'added_channel', listener: (msg: typeChannel) => void): this;
  on(event: 'updated_channel', listener: (msg: typeChannel) => void): this;
  on(event: 'delete_channel', listener: (msg: delete_channel) => void): this;
  on(event: 'pinned_message', listener: (msg: pinned_message) => void): this;
  on(event: 'unpinned_message', listener: (msg: unpinned_message) => void): this;
  on(event: 'updated_private_message', listener: (msg: updated_private_message) => void): this;
  on(event: 'deleted_private_message', listener: (msg: deleted_private_message) => void): this;
  on(event: 'private_added_reaction', listener: (msg: private_added_reaction) => void): this;
  on(event: 'private_deleted_reaction', listener: (msg: private_deleted_reaction) => void): this;
  on(event: 'joined_guild', listener: (msg: joined_guild) => void): this;
  on(event: 'exited_guild', listener: (msg: exited_guild) => void): this;
  on(event: 'updated_guild_member', listener: (msg: updated_guild_member) => void): this;
  on(event: 'guild_member_online', listener: (msg: guild_member_online) => void): this;
  on(event: 'guild_member_offline', listener: (msg: guild_member_offline) => void): this;
  on(event: 'added_role', listener: (msg: added_role) => void): this;
  on(event: 'deleted_role', listener: (msg: deleted_role) => void): this;
  on(event: 'updated_role', listener: (msg: updated_role) => void): this;
  on(event: 'updated_guild', listener: (msg: updated_guild) => void): this;
  on(event: 'deleted_guild', listener: (msg: deleted_guild) => void): this;
  on(event: 'added_block_list', listener: (msg: added_block_list) => void): this;
  on(event: 'deleted_block_list', listener: (msg: deleted_block_list) => void): this;
  on(event: 'joined_channel', listener: (msg: joined_channel) => void): this;
  on(event: 'exited_channel', listener: (msg: exited_channel) => void): this;
  on(event: 'user_updated', listener: (msg: user_updated) => void): this;
  on(event: 'self_joined_guild', listener: (msg: self_joined_guild) => void): this;
  on(event: 'self_exited_guild', listener: (msg: self_exited_guild) => void): this;
  on(event: 'message_btn_click', listener: (msg: message_btn_click) => void): this;
}

export interface message_btn_click {
  value: string,
  msg_id: string,
  user_id: string,
  target_id : string
}

export interface self_exited_guild {
  guild_id: string
}

export interface self_joined_guild {
  guild_id: string
}

export interface user_updated {
  user_id: string,
  username: string,
  avatar: string
}

export interface exited_channel {
  user_id: string,
  channel_id: string,
  exited_at: number
}

export interface joined_channel {
  user_id: string,
  channel_id: string,
  joined_at: number
}

export interface deleted_block_list {
  operator_id: string,
  user_id: string[]
}

export interface added_block_list {
  operator_id: string,
  remark: string,
  user_id: string[]
}

export interface deleted_guild {
  id: string,
  name: string,
  user_id: string,
  icon: string,
  notify_type: number,
  region: string,
  enable_open: number,
  open_id: number,
  default_channel_id: string,
  welcome_channel_id: string
}

export interface updated_guild {
  id: string,
  name: string,
  user_id: string,
  icon: string,
  notify_type: number,
  region: string,
  enable_open: number,
  open_id: number,
  default_channel_id: number,
  welcome_channel_id: number
}

export interface updated_role {
  role_id: number,
  name: string,
  color: number,
  position: number,
  hoist: number,
  mentionable: number,
  permissions: number
}

export interface deleted_role {
  role_id: number,
  name: string,
  color: number,
  position: number,
  hoist: number,
  mentionable: number,
  permissions: number
}

export interface added_role {
  role_id: number,
  name: string,
  color: number,
  position: number,
  hoist: number,
  mentionable: number,
  permissions: number
}

export interface guild_member_offline {
  user_id: string,
  event_time: number,
  guilds: string[]
}

export interface guild_member_online {
  user_id: string,
  event_time: number,
  guilds: string[]
}

export interface updated_guild_member {
  user_id: string,
  nickname: string
}

export interface exited_guild {
  user_id: string,
  exited_at: number
}

export interface joined_guild {
  user_id: string,
  joined_at: number
}

export interface private_deleted_reaction {
  emoji: {
    id: string,
    name: string
  },
  user_id: string,
  chat_code: string,
  msg_id: string
}

export interface private_added_reaction {
  emoji: {
    id: string,
    name: string
  },
  user_id: string,
  chat_code: string,
  msg_id: string
}

export interface deleted_private_message {
  chat_code: string,
  msg_id: string,
  author_id: string,
  target_id: string,
  deleted_at: number
}

export interface updated_private_message {
  author_id: string,
  target_id: string,
  msg_id: string,
  content: string,
  updated_at: number,
  chat_code: string
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

export interface add_reaction {
  channel_id: string,
  emoji: {
    id: string,
    name: string,
  },
  user_id: string,
  msg_id: string
}

export interface delete_reaction {
  channel_id: string,
  emoji: {
    id: string,
    name: string,
  },
  user_id: string,
  msg_id: string
}

export interface update_message {
  channel_id: string,
  content: string,
  mention: string[],
  mention_all: boolean,
  mention_here: boolean,
  mention_roles: TypeRole[],
  updated_at: number,
  msg_id: string
}

export interface delete_message {
  channel_id: string,
  msg_id: string
}

export interface delete_channel {
  id: string,
  delete_at: number
}

export interface unpinned_message {
  channel_id: string,
  operator_id: string,
  msg_id: string
}

export interface pinned_message {
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
  public PrivateChat: PrivateChat
  public PrivateMessage: PirvateMessage
  public Asset: Asset
  public Role: Role

  public Logger: (category?: string) => Logger;

  constructor (token: string) {
    super()
    this.token = token
    this.ws = new ws(this.token)

    this.Server = new Server(this.token)
    this.Messages = new Messages(this.token)
    this.Channel = new Channel(this.token)
    this.PrivateChat = new PrivateChat(this.token)
    this.PrivateMessage = new PirvateMessage(this.token)
    this.Asset = new Asset(this.token)
    this.Role = new Role(this.token)

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

  getCardBuilder () {
    return new CardBuilder()
  }
}

export default Bot