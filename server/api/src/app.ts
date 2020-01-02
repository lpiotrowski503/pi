import * as express from 'express'
// ────────────────────────────────────────────────────────────────────────────────
import db from './startup/db'
import config from './startup/config'
import routes from './startup/routes'
import server from './startup/server'

const app = express()

db()
config(app)
routes(app)
server(app)
