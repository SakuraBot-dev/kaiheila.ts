import got from 'got'
import logger from '../logger'

export interface KaiheilaAPIReturn {
  code: number
  message: string
  data: any
}

export default class API {
  private token: string
  constructor(token: string) {
    this.token = token
  }

  public async get (url: string, args: {[index: string]: string | number} = {}) {
    logger('HTTP-GET').debug(url, args)

    const arg = []
    for (const name in args) {
      arg.push(`${name}=${args[name]}`)
    }
    
    const result: KaiheilaAPIReturn = await got.get(encodeURI(`https://www.kaiheila.cn/api/v3${url}?${arg.join('&')}`), {
      headers: {
        Authorization: `Bot ${this.token}`
      }
    }).json()
    if (result.code === 0) return result.data
    throw new Error(result.message)
  }

  public async post (url: string, data: any) {
    logger('HTTP-POST').debug(url, data)

    const result: KaiheilaAPIReturn = await got.post(encodeURI(`https://www.kaiheila.cn/api/v3${url}`), {
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).json()
    if (result.code === 0) return result.data
    throw new Error(result.message)
  }

  public async form (url: string, data: any) {
    const result: KaiheilaAPIReturn = await got.post(encodeURI(`https://www.kaiheila.cn/api/v3${url}`), {
      headers: {
        Authorization: `Bot ${this.token}`,
        'Content-type': 'form-data'
      },
      form: data
    }).json()
    if (result.code === 0) return result.data
    throw new Error(result.message)
  }
}