const User = require('./user_model')
const { generateToken } = require('../utils/jwt_utils')

async function createUser(email, password) {
  try {
    const token = await generateToken(email)
    const user = new User({ email, password, token: token })
    user.token = token
    await user.save()
    return user
  } catch (error) {
    throw error
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.checkEmail(email)
    if (!user) {
      throw new Error('User not found')
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new Error('Invalid credentials')
    }
    const token = await generateToken(email)
    user.token = token
    await user.save()

    return { user, token }
  } catch (error) {
    throw error
  }
}

async function verify_token(token) {
  try {
    const user = await User.findOne({ token: token })
    if (!user) {
      throw new Error('User not found')
    }
    user.verified = true
    await user.save()
    return true
  } catch (error) {
    throw error
  }
}



module.exports = {
  createUser,
  loginUser,
  verify_token,
}
