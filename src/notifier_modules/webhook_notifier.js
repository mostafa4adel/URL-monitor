const Notifier = require('./notifier_interface')
axios = require('axios')

class WebhookNotifier extends Notifier {
  static #instance = null

  constructor() {
    super()
  }

  static getInstance() {
    if (!WebhookNotifier.#instance) {
      WebhookNotifier.#instance = new WebhookNotifier()
    }
    return WebhookNotifier.#instance
  }

  async sendNotification(subject, message, settings) {
    try {
      if (!settings || !subject || !message) {
        throw new Error('Invalid webhook notification')
      }

      await axios.post(settings.url, {
        subject: subject,
        message: message,
      })
    } catch (error) {
      throw error
    }
  }

  async validateSettings(settings) {
    try {
      if (!settings.url) {
        throw new Error('Invalid webhook settings')
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = WebhookNotifier
