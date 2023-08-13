const { verifyToken } = require('../utils/jwt_utils')

async function authMiddleware(req, res, next) {
  try {
    const token = extractTokenFromHeader(req)
    const decoded = await verifyToken(token)
    req.email = decoded

    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}

function extractTokenFromHeader(req) {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header')
  }

  return authorizationHeader.split(' ')[1]
}

function validateTags(req, res, next) {
  const tags = req.query.tags.split(',')

  //api/reports/report?tags=tag1,tag2,tag3
  req.body.tags = tags
  if (!tags) {
    res.status(400).json({ error: 'Invalid Data' })
    return
  }

  next()
}

module.exports = {
  auth: authMiddleware,
  validateTags,
}
