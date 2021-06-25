import http from '../http'
import { User } from './server'

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  /**
   * @description 获取频道列表
   * @param server_id 服务器id
   */
  async getChannelList (server_id: string): Promise<{
    id: string
    master_id: string
    parent_id: string
    name: string
    type: number
    level: number
    limit_amount: number
    is_category: boolean
  }> {
    return await this.http.get('/channel/list', {
      guild_id: server_id
    })
  }

  /**
   * @description 获取频道详情
   * @param channel_id 频道id
   */
  async getChannelInfo (channel_id: string): Promise<{
    id: string,
    guild_id: string,
    master_id: string,
    parent_id: string,
    name: string,
    topic: string,
    type: number,
    level: number,
    slow_mode: number,
    voice_quality: number,
    is_category: boolean,
    server_url: string
  }> {
    return await this.http.get('/channel/view', {
      target_id: channel_id
    })
  }

  /**
   * @description 创建频道
   * @param options 选项
   */
  async createChannel (options: {
    guild_id: string,
    parent_id: string,
    name: string,
    type?: number,
    limit_amount?: number,
    voice_quality?: number
  }) {
    return await this.http.post('/channel/create', options)
  }

  /**
   * @description 删除频道
   * @param channel_id 频道id
   */
  async deleteChannel (channel_id: string) {
    return await this.http.post('/channel/delete', { channel_id })
  }

  /**
   * @description 把用户移动到指定的语音频道内
   * @param channel_id 目标频道id
   * @param users 用户uid列表
   */
  async moveUser (channel_id: string, users: string[]) {
    return await this.http.post('/channel/move-user', {
      target_id: channel_id,
      user_ids: users
    })
  }

  /**
   * @description 获取频道角色详情
   * @param channel_id 频道id
   */
  async getRole (channel_id: string): Promise<{
    permission_overwrites: {
      role_id: number,
      allow: number,
      deny: number
    }[],
    permission_users: {
      user: User,
      allow: number,
      deny: number
    },
    permission_sync: number
  }> {
    return await this.http.get('/channel-role/index', {
      channel_id: channel_id
    })
  }

  /**
   * @description 创建角色
   * @param options 选项
   */
  async createRole (options: {
    channel_id: string,
    type: string,
    value: string
  }) {
    return await this.http.post('/channel-role/create', options)
  }

  /**
   * @description 更新角色
   * @param options 选项
   */
  async updateRole (options: {
    channel_id: string,
    type?: string,
    value?: string,
    allow?: number,
    deny?: number
  }) {
    return await this.http.post('/channel-role/update', options)
  }

  /**
   * @description 删除角色
   * @param options 选项
   */
  async deleteRole (options: {
    channel_id: string,
    type: string,
    value: string
  }) {
    return await this.http.post('/channel-role/delete', options)
  }
}