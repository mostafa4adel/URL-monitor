const mongoose = require('mongoose')
const { mongoConfig } = require('../config')

const connectDb = async () => {
  await mongoose.connect(mongoConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.log('Connected to MongoDB')
}

module.exports = { connectDb }
