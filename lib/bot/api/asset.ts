import http from '../http'
import fs from 'fs'

export default class Messages {
  private http: http
  private token: string

  constructor (token: string) {
    this.token = token
    this.http = new http(this.token)
  }

  async upload (file: string | Buffer) {
    const buffer = typeof file === 'string' ? await fs.promises.readFile(file) : file
    this.http.form('/asset/create', {
      file: buffer
    })
  }
}