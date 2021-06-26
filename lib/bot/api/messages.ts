import CardBuilder from '../CardBuilder'
import http from '../http'
import { Role } from './server'

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  /**
   * @description 获取消息列表
   * @param channelId 频道id
   * @param options 选项
   */
  async getMessageList (channelId: string, options: {
    msg_id?: string,
    pin?: number,
    flag?: string
  }) {
    const data: any = {}

    data.target_id = channelId
    if (options.msg_id) data.msg_id = options.msg_id
    if (options.pin) data.pin = options.pin
    if (options.flag) data.flag = options.flag

    return await this.http.post('/message/list', data)
  }

  /**
   * @description 发送消息
   * @param options 选项
   */
  async sendMessage (options: {
    type: number,
    target_id: string,
    content: string | CardBuilder  | CardBuilder[],
    quote?: string,
    temp_target_id?: string
  }): Promise<{
    msg_id: string,
    msg_timestamp: number,
    nonce: string
  }> {
    const copy = {...options}
    if (copy.content instanceof Array) {
      copy.content = JSON.stringify(copy.content.map(e => e.card))
    } else if (typeof copy.content === 'object') {
      copy.content = JSON.stringify([copy.content.card])
    }

    return await this.http.post('/message/create', {
      nonce: (Math.random()*1e16).toString(16),
      ...copy
    })
  }

  /**
   * @description 更新消息
   * @param options 选项
   */
  async updateMessage (options: {
    msg_id: string,
    content: string,
    quote?: string,
    temp_target_id?: string
  }) {
    return await this.http.post('/message/update', options)
  }

  /**
   * @description 回应列表
   * @param msg_id 消息id
   * @param emoji emoji
   */
  async getReaction (msg_id: string, emoji: string): Promise<{
    id: string
    username: string
    identify_num: string
    online: boolean,
    os: string,
    status: number,
    avatar: string,
    vip_avatar: string,
    nickname: string,
    roles: Role[],
    is_vip: boolean,
    bot: boolean,
    reaction_time: number
  }[]> {
    return await this.http.get('/message/reaction-list', {
      msg_id: msg_id,
      emoji: emoji
    })
  }

  /**
   * @description 添加回应
   * @param msg_id 消息id
   * @param emoji emoji
   */
  async addReaction (msg_id: string, emoji: string) {
    return this.http.post('/message/add-reaction', {
      msg_id: msg_id,
      emoji: emoji
    })
  }

  /**
   * @description 删除回应
   * @param msg_id 消息id
   * @param emoji emoji
   * @param user_id 用户id
   */
  async deleteReaction (msg_id: string, emoji: string, user_id?: string) {
    return this.http.post('/message/delete-reaction', {
      msg_id: msg_id,
      emoji: emoji,
      user_id: user_id
    })
  }
}