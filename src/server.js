const { connectDb } = require('./utils/mongo_util')
const router = require('./router')
const express = require('express')
const { NODE_PORT } = require('./config')

const app = express()

app.use(express.json())
app.use('/api', router)

app.listen(
  NODE_PORT,
  () =>
    connectDb() &
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
)

module.exports = app
