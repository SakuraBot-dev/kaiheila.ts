import http from '../http'

export default class PirvateMessage {
  private token: string
  private http: http

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  /**
   * @description 获取私聊会话列表
   */
  async getChatList (): Promise<{
    code: string,
    last_read_time: number,
    latest_msg_time: number,
    unread_count: number,
    target_info: {
      id: string,
      username: string,
      online: boolean,
      avatar: string
    },
  }[]> {
    return (await this.http.get('/user-chat/list')).items
  }

  /**
   * @description 获取会话详情
   * @param chat_code 会话code
   */
  async getChatInfo (chat_code: string): Promise<{
    code: string,
    last_read_time: number,
    latest_msg_time: number,
    unread_count: number,
    is_friend: boolean,
    is_blocked: boolean,
    is_target_blocked: boolean,
    target_info: {
      id: string,
      username: string,
      avatar: string,
    }
  }> {
    return await this.http.get('/api/v3/user-chat/view', {
      chat_code: chat_code
    })
  }

  /**
   * @description 创建私聊会话
   * @param user_id 目标用户id
   */
  async createChat (user_id: string): Promise<{
    code: string,
    last_read_time: number,
    latest_msg_time: number,
    unread_count: 0,
    is_friend: boolean,
    is_blocked: boolean,
    is_target_blocked: boolean,
    target_info: {
      id: string,
      username: string,
      online: boolean,
      avatar: string
    }
  }> {
    return await this.http.post('/user-chat/create', {
      target_id: user_id
    })
  }

  /**
   * @description 删除私聊会话
   * @param chat_code 会话code
   */
  async deleteChat (chat_code: string) {
    return await this.http.post('/user-chat/delete', {
      chat_code: chat_code
    })
  }
}