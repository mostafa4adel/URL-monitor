const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      uniqueCaseInsensitive: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Email must be valid',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [5, 'Password must be at least 5 characters long'],
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.pre('save', async function (next) {
  try {
    const user = this
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(4)
      user.salt = salt
      user.password = await bcrypt.hash(user.password, salt)
    }
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} is already taken',
})

const User = mongoose.model('User', UserSchema)

User.createIndexes()
User.checkEmail = async function (email) {
  return await this.model('User').findOne({ email })
}

module.exports = User
