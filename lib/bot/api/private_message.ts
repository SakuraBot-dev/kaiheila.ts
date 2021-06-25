import http from '../http'

export default class PirvateMessage {
  private token: string
  private http: http

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  /**
   * @description 获取消息列表
   * @param options 选项
   */
  async getMessageList (options: {
    chat_code?: string,
    target_id?: string,
    msg_id?: string,
    flag?: 'before' | 'around' | 'after'
  }) {
    if (!options.chat_code && !options.target_id) throw new Error('chat_code 和 target_id 必填一个')
    this.http.get('/direct-message/list', options)
  }

  /**
   * @description 发送消息
   * @param options 选项
   */
  async sendMessage (options: {
    type?: number,
    target_id?: string,
    chat_code?: string,
    content?: string,
    quote?: string
  }): Promise<{
    msg_id: string,
    msg_timestamp: number,
    nonce: string
  }> {
    if (!options.chat_code && !options.target_id) throw new Error('chat_code 和 target_id 必填一个')
    return await this.http.post('/direct-message/create', {
      nonce: (Math.random()*1e16).toString(16),
      ...options
    })
  }

  /**
   * @description 更新消息
   * @param msg_id 消息id
   * @param content 消息内容
   * @param quote 被回复消息id
   * @returns 
   */
  async updateMessage (msg_id: string, content: string, quote?: string) {
    return await this.http.post('/direct-message/update', { msg_id, content, quote })
  }

  /**
   * @description 删除消息
   * @param msg_id 消息id
   * @returns 
   */
  async deleteMessage (msg_id: string) {
    return await this.http.post('/direct-message/delete', { msg_id })
  }

  async getReactionList (msg_id: string, emoji: string): Promise<{
    id: string,
    username: string,
    nickname: string,
    identify_num: string,
    online: boolean,
    status: number,
    avatar: string,
    bot: boolean,
    reaction_time: number
  }[]> {
    return await this.http.post('/direct-message/reaction-list', { msg_id, emoji })
  }

  async addReaction (msg_id: string, emoji: string) {
    return await this.http.post('/direct-message/add-reaction', { msg_id, emoji })
  }

  async deleteReaction (msg_id: string, emoji: string) {
    return await this.http.post('/direct-message/delete-reaction', { msg_id, emoji })
  }
}