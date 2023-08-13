const validate = require('validate.js')

function validate_user(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  const user = { email, password }

  const constraints = {
    email: {
      presence: true,
      email: true,
      length: {
        minimum: 10,
      },
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
      },
    },
  }
  if (!validate(user, constraints)) {
    next()
  } else {
    res.status(400).json({ message: 'Invalide Data' })
  }
}

module.exports = {
  validate_user,
}
