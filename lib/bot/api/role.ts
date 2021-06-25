import http from '../http'

interface Permissions {
  admin: boolean, // 管理员
  editServer: boolean, // 管理服务器
  readLog: boolean, // 查看日志
  createInvite: boolean, // 创建邀请链接
  editInvite: boolean, // 管理邀请
  editChannel: boolean, // 管理频道
  kickUser: boolean, // 踢出用户
  banUser: boolean, // 封禁用户
  editSticker: boolean, // 管理表情包
  editSelfNickname: boolean, // 修改昵称
  editRole: boolean, // 管理角色
  viewChannel: boolean, // 查看文字、语音频道
  sendMessage: boolean, // 发送消息
  editMessage: boolean, // 管理消息
  uploadFile: boolean, // 上传文件
  audioLink: boolean, // 语音链接
  editAudio: boolean, // 语音管理
  atAll: boolean, // @全体
  addReaction: boolean, // 添加反应
  followReaction: boolean, // 跟随添加反应
  PassivelyConnectVoiceChannel: boolean, // 被动连接语音频道
  buttonSpeak: boolean, // 按键说话
  freeSpeak: boolean, // 自由说话
  speak: boolean, // 说话
  serverMute: boolean, // 服务器静音
  serverMuted: boolean, // 服务器闭麦
  editNickname: boolean, // 修改他人昵称
  playBGM: boolean // 播放伴奏
}

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  private setPermissions (options: Permissions) {
    const map: string[] = ['admin', 'editServer', 'readLog', 'createInvite', 'editInvite', 'editChannel', 'kickUser', 'banUser', 'editSticker', 'editSelfNickname', 'editRole', 'viewChannel', 'sendMessage', 'editMessage', 'uploadFile', 'audioLink', 'editAudio', 'atAll', 'addReaction', 'followReaction', 'PassivelyConnectVoiceChannel', 'buttonSpeak', 'freeSpeak', 'speak', 'serverMute', 'serverMuted', 'editNickname', 'playBGM']
    const bit: number[] = []
    
    bit.fill(0, 0, 27)
    
    for (const index of map) {
      // @ts-ignore
      const value = options[index]
      if (value) bit[map.indexOf(index)] = 1
    }

    return parseInt(map.join(''), 2)
  }

  private getPermissions (permissions: number): Permissions {
    const map: string[] = ['admin', 'editServer', 'readLog', 'createInvite', 'editInvite', 'editChannel', 'kickUser', 'banUser', 'editSticker', 'editSelfNickname', 'editRole', 'viewChannel', 'sendMessage', 'editMessage', 'uploadFile', 'audioLink', 'editAudio', 'atAll', 'addReaction', 'followReaction', 'PassivelyConnectVoiceChannel', 'buttonSpeak', 'freeSpeak', 'speak', 'serverMute', 'serverMuted', 'editNickname', 'playBGM']
    const bit: number[] = permissions.toFixed(2).split('').map(e => Number(e))
    
    // @ts-ignore
    const data: Permissions = {}

    for (const index in map) {
      const key = map[index]
      const value = bit[index]
      // @ts-ignore
      data[key] = value
    }

    return data
  }

  /**
   * @description 获取角色列表
   * @param server_id 服务器id
   */
  async getRoleList (server_id: string): Promise<{
    role_id: number,
    name: string,
    color: number,
    position: number,
    hoist: number,
    mentionable: number,
    permissions: Permissions
  }[]> {
    const result: { items: any[] } = await this.http.get('/guild-role/list', {
      guild_id: server_id
    })

    const items: any[] = result.items.map(e => {
      const copy = { ...e }
      copy.permission = this.getPermissions(copy.permission)
    })

    return items
  }

  /**
   * @description 创建角色
   * @param name 角色名
   * @param server_id 服务器id
   */
  async createRole (name: string, server_id: string) {
    return await this.http.post('/guild-role/create', {
      name: name,
      guild_id: server_id
    })
  }

  /**
   * @description 更新角色
   * @param options 选项
   * @returns 
   */
  async updateRole (options: {
    guild_id: string,
    role_id: number,
    hoist?: number,
    mentionable?: number,
    permissions?: number | Permissions,
    color?: number,
    name?: string
  }) {
    const copy = { ...options }
    if (typeof copy.permissions === 'object') copy.permissions = this.setPermissions(copy.permissions)

    return await this.http.post('/guild-role/update', copy)
  }

  async deleteRole (server_id: string, role_id: number) {
    return await this.http.post('/api/v3/guild-role/delete', {
      guild_id: server_id,
      role_id: role_id
    })
  }

  /**
   * @description 授予用户角色
   * @param server_id 服务器id
   * @param user_id 用户id
   * @param role_id 角色id
   */
  async grant (server_id: string, user_id: string, role_id: string) {
    return await this.http.post('/api/v3/guild-role/grant', {
      guild_id: server_id,
      user_id: user_id,
      role_id: role_id
    })
  }

  /**
   * @description 撤回用户角色
   * @param server_id 服务器id
   * @param user_id 用户id
   * @param role_id 角色id
   * @returns 
   */
  async revoke (server_id: string, user_id: string, role_id: string) {
    return await this.http.post('/api/v3/guild-role/revoke', {
      guild_id: server_id,
      user_id: user_id,
      role_id: role_id
    })
  }
}