const dotenv = require('dotenv')
dotenv.config()

const { JWT_SECRET, NODE_PORT } = process.env

const { EMAIL, EMAIL_SERVICE, EMAIL_PASSWORD } = process.env

const mongoConfig = {
  database: process.env.MONGO_INITDB_DATABASE,
  collection: process.env.MONGO_INITDB_COLLECTION,
  uri: process.env.MONGO_URI,
}

module.exports = {
  JWT_SECRET,
  mongoConfig,
  NODE_PORT,
  EMAIL,
  EMAIL_SERVICE,
  EMAIL_PASSWORD,
}
