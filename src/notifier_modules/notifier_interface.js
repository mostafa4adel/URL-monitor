class Notifier {
  constructor() {
    if (this.constructor === Notifier) {
      throw new Error(
        'Notifier is an abstract class and cannot be instantiated directly.'
      )
    }
  }

  sendNotification(subject, message, settings) {
    throw new Error('sendNotification method must be implemented.')
  }

  validateSettings(settings) {
    throw new Error('validateSettings method must be implemented.')
  }
}

module.exports = Notifier
