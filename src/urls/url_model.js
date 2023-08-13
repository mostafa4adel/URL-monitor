const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const url_schema = new mongoose.Schema({
  unique_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: () => {
      return new Date().getTime().toString(36) // to genrate a unique identifier for every url
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isURL(value, { require_protocol: false })) {
        throw new Error('Invalid URL')
      }
    },
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  category: {
    type: String,
    required: false,
    trim: true,
  },
  protocol: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isIn(value, ['http', 'https', 'tcp'])) {
        throw new Error('Invalid Protocol')
      }
    },
  },
  path: {
    type: String,
    required: false,
    trim: true,
    default: '/',
  },
  port: {
    type: Number,
    required: false,
    trim: true,
    default: 80,
    validate(value) {
      if (value < 0) {
        throw new Error('Invalid Port')
      }
    },
  },
  timeout: {
    type: Number,
    required: false,
    default: 5, // in seconds
    trim: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Invalid Timeout')
      }
    },
  },
  interval: {
    type: Number,
    required: false,
    default: 10 * 60, // in seconds
    trim: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Invalid Interval')
      }
    },
  },
  threshold: {
    type: Number,
    required: false,
    default: 1,
    trim: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Invalid Threshold')
      }
    },
  },
  authentication: {
    type: Boolean,
    required: false,
    default: false,
    trim: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Invalid Authentication')
      }
    },
  },
  authentication_username: {
    type: String,
    required: false,
    trim: true,
  },
  authentication_password: {
    type: String,
    required: false,
    trim: true,
  },
  httpHeaders: {
    type: Object,
    required: false,
    trim: true,
    default: {},
  },
  assert: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  tags: [
    {
      type: String,
      required: false,
      trim: true,
    },
  ],
  ignoreSSL: {
    type: Boolean,
    required: true,
    trim: true,
  },
  lastState: {
    type: String,
    required: false,
    trim: true,
    default: 'DOWN',
  },
  email_notifier: {
    type: Object,
    required: true,
    trim: true,
    default: {},
  },
  webhook_notifier: {
    type: Object,
    required: false,
    trim: true,
    default: {},
  },
  pushover_notifier: {
    type: Object,
    required: false,
    trim: true,
    default: {},
  },
  susscessfullChecks: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },

  availability: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  outages: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  downtime: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  uptime: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  totalResponseTime: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  avgResponseTime: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },

  history: {
    type: Array,
    required: false,
    trim: true,
    default: [],
  },
})

url_schema.pre('save', async function (next) {
  const url = this
  url.availability = 100
  url.outages = 0
  url.downtime = 0
  url.uptime = 0
  url.responseTime = 0
  url.history = []

  next()
})

url_schema.plugin(uniqueValidator)
url_schema.index({ url: 1, user: 1 }, { unique: true })

const url_model = mongoose.model('url', url_schema)

module.exports = url_model
