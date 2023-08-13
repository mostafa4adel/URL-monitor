const router = require('express').Router()
const { createUser, loginUser, verify_token } = require('./user_handler')
const { validate_user } = require('./user_middleware')

const { send_email } = require('../utils/mail_service')

router.get('/verify_email/:token', async (req, res) => {
  try {
    const token = req.params.token.slice(1)

    const verified = await verify_token(token)
    if (verified) res.status(200).json({ message: 'Email verified' })
    else res.status(400).json({ error: 'Invalid Token' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'User not found' })
  }
})

router.use('/', validate_user)

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    user = await createUser(email, password)
    const verificationToken = user.token

    // localhost so that it works on local machine only for now
    const email_content = `<h1>Click on the link to verify your email</h1>
      <a href="http://localhost:3000/api/users/verify_email/:${verificationToken}">Click here</a>`
    // =========================================

    await send_email(email, 'Verify Email', email_content)
    const response = {
      user: {
        email: user.email,
      },
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(503).json({ message: 'Replicated User or Invalid Data' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const output = await loginUser(email, password)
    const response = {
      user: {
        email: output.user.email,
      },
      token: output.token,
    }
    if (output.user.verified) {
      res.status(200).json(response)
    } else {
      res.status(403).json({ error: 'Email not verified' })
    }
  } catch (error) {
    console.log(error)
    console.log(error.message)
    res.status(400).json({ error: 'Invalid Credentials' })
  }
})

module.exports = router
