const Notifier = require('./notifier_interface')
const pushover = require('pushover-notifications')

class Pushover_notifier extends Notifier {
  static #instance = null

  constructor() {
    super()
  }

  static getInstance() {
    if (!Pushover_notifier.#instance) {
      Pushover_notifier.#instance = new Pushover_notifier()
    }
    return Pushover_notifier.#instance
  }

  async sendNotification(subject, message, settings) {
    try {
      if (!settings || !subject || !message) {
        throw new Error('Invalid pushover notification')
      }

      var p = new pushover({
        token: settings.token,
      })

      var msg = {
        message: message,
        title: subject,
        sound: 'magic',
        priority: 1,
      }

      p.send(msg, function (err, result) {
        if (err) {
          throw err
        }
      })
    } catch (error) {
      throw error
    }
  }

  async validateSettings(settings) {
    try {
      if (!settings.token) {
        throw new Error('Invalid pushover settings')
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = Pushover_notifier
