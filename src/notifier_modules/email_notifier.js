const Notifier = require('./notifier_interface')

const send_email = require('../utils/mail_service')

//single email notifier
class EmailNotifier extends Notifier {
  static emailNotifier = null
  constructor() {
    if (EmailNotifier.emailNotifier) {
      return EmailNotifier.emailNotifier
    } else {
      super()
      EmailNotifier.emailNotifier = this
      return this
    }
  }

  async sendNotification(subject, message, settings) {
    try {
      if (!settings || !subject || !message) {
        throw new Error('Invalid email notification')
      }

      await send_email(subject, message, settings)
    } catch (error) {
      throw error
    }
  }

  async validateSettings(settings) {
    try {
      if (!settings.email) {
        throw new Error('Invalid email settings')
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = { EmailNotifier }
