import http from '../http'

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  async me (): Promise<{
    id: string,
    username: string,
    identify_num: string,
    online: boolean,
    status: number,
    avatar: string,
    bot: boolean,
    mobile_verified: boolean,
    client_id: string,
    mobile_prefix: string,
    mobile: string,
    invited_count : number,
  }> {
    return await this.http.get('/user/me')
  }
}