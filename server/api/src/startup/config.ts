import * as express from 'express'
import * as cors from 'cors'
import * as path from 'path'

class Config {
  config(app) {
    app.use(cors())
    app.use(express.json())
    app.use(express.static(path.join(__dirname, '../../public')))
  }
}

export default new Config().config
