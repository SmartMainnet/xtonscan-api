import 'dotenv/config'
import express, { Express } from 'express'

import { router } from './routes/index.js'

const { PORT } = process.env

const app: Express = express()

app.use(express.json())
app.use('/api/v1', router)

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

server.on('error', err => {
  console.error(err)
})
