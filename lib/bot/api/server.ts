import http from '../http'

export interface Role {
  role_id: number
  name: string
  color: number
  position: number,
  hoist: number,
  mentionable: number,
  permissions: number
}

export interface Channel {
  id: string,
  user_id: string,
  parent_id: string,
  name: string,
  type: number,
  level: number,
  limit_amount: number,
  is_category: boolean,
  is_readonly: boolean,
  is_private: boolean
}

export interface User {
  id: string,
  username: string,
  avatar: string,
  online: boolean,
  nickname: string,
  joined_at: number,
  active_time: number,
  roles: Role[],
  is_master: boolean,
  abbr: string
}

export interface ServerListItem {
  id: string // 服务器id
  name: string // 服务器名称
  topic: string // 服务器主题
  master_id: string // 服务器主id
  icon: string // 服务器icon地址
  notify_type: number // 通知类型
  region: string // 服务器使用的语音区域
  enable_open: boolean // 是否为公开服务器
  open_id: string // 公开服务器id
  default_channel_id: string // 默认频道id
  welcome_channel_id: string // 欢迎频道id
}

export interface ServerInfo {
  id: string // 服务器id
  name: string // 服务器名称
  topic: string // 服务器主题
  master_id: string // 服务器主题id
  icon: string // 服务器icon地址
  notify_type: number // 通知类型
  region: string // 服务器使用的语音区域
  enable_open: boolean // 是否为公开服务器
  open_id: string // 公开服务器id
  default_channel_id: string // 默认频道id
  welcome_channel_id: string // 欢迎频道id
  roles: Role[] // 角色列表
  channels: Channel[] // 频道列表
}

export interface UserList {
  items: User[]
  user_count: number
  online_count: number
  offline_count: number
}

export interface MuteList {
  mic: {
    type: 1,
    user_ids: string[]
  },
  headset: {
    type: 2,
    user_ids: string[]
  }
}

export default class ServerAPI {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  /**
   * @description 获取服务器列表
   */
  async getServerList (): Promise<ServerListItem[]> {
    const result = await this.http.get('/guild/list')
    return result.items
  }

  /**
   * @description 获取服务器详情
   * @param server_id 服务器id
   */
  async getServerInfo (server_id: string): Promise<ServerInfo> {
    return await this.http.get('/guild/view', {
      guild_id: server_id
    })
  }

  /**
   * @description 获取用户列表
   * @param server_id 服务器id
   * @param options 查找选项
   */
  async getUserList (server_id: string, options: {
    channel_id?: string,
    search?: string,
    role_id?: number,
    mobile_verified?: number,
    active_time?: number,
    joined_at?: number,
    page?: number,
    page_size?: number
  }):Promise<UserList> {
    return await this.http.get('/guild/user-list', {
      guild_id: server_id,
      ...options
    })
  }

  /**
   * @description 更新用户昵称
   * @param server_id 服务器id
   * @param options 选项
   */
  async updateNickname (server_id: string, options: {
    nickname?: string,
    user_id?: string
  }) {
    const data: any = {}
    
    data.guild_id = server_id

    if (options.nickname) data.nickname = options.nickname
    if (options.user_id) data.user_id = options.user_id
    
    return await this.http.post('/guild/nickname', data)
  }

  /**
   * @description 离开服务器
   * @param server_id 服务器id
   */
  async leave (server_id: string) {
    return await this.http.post('/guild/leave', {
      guild_id: server_id
    })
  }

  /**
   * @description 踢出服务器
   * @param server_id 服务器id
   * @param userId 用户id
   */
  async kick (server_id: string, userId: string) {
    return await this.http.post('/guild/kickout', {
      guild_id: server_id,
      target_id: userId
    })
  }

  /**
   * @description 查看语音闭麦列表
   * @param server_id 服务器id
   */
  async MuteList (server_id: string): Promise<MuteList> {
    return await this.http.get('/guild-mute/list', {
      guild_id: server_id,
      return_type: 'detail'
    })
  }

  /**
   * @description 设置语音闭麦
   * @param server_id 服务器id
   * @param userId 用户id
   * @param type 类型
   * @param enable 是否闭麦
   */
  async setMute (server_id: string, userId: string, type: number, enable: boolean) {
    if (enable) {
      return await this.http.post('/guild-mute/create', {
        guild_id: server_id,
        user_id: userId,
        type: type
      })
    } else {
      return await this.http.post('/guild-mute/delete', {
        guild_id: server_id,
        user_id: userId,
        type: type
      })
    }
  }
}