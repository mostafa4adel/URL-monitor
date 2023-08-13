const nodemailer = require('nodejs-nodemailer-outlook')

const { EMAIL, EMAIL_PASSWORD } = require('../config')

async function send_email(email, subject, content) {
  try {
    await nodemailer.sendEmail({
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
      from: EMAIL,
      to: email,
      subject: subject,
      html: content,
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  send_email,
}
