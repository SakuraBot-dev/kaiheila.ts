import http from '../http'

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }
  
  /**
   * @description 获取亲密度
   * @param user_id 用户id
   */
  async get (user_id: string): Promise<{
    img_url: string,
    social_info: string,
    last_modify: number,
    last_read: number,
    score: number,
    img_list: {
      id: number,
      url: string
    }[]
  }> {
    return await this.http.get('/intimacy/index', {
      user_id: user_id
    })
  }

  async set (user_id: string, score: number, social_info: string, img_id: number) {
    return await this.http.post('/intimacy/update', {
      user_id: user_id,
      score: score,
      social_info: social_info,
      img_id: img_id
    })
  }
}