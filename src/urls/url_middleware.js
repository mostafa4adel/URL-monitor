const { verifyToken } = require('../utils/jwt_utils')

async function auth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      // No authorization header
      throw new Error('Authentication required')
    }

    const token = req.headers.authorization.split(' ')[1]
    const decoded = await verifyToken(token)

    // Attach the decoded email to the request object
    req.email = decoded

    // Proceed to the next middleware
    next()
  } catch (error) {
    console.error(error)

    // Handle authentication errors
    res.status(401).json({ error: 'Authentication failed' })
  }
}

async function validate_data(req, res, next) {
  try {
    // Validate the URL data based on the route
    if (
      req.originalUrl === '/create_url' ||
      req.originalUrl === '/update_url'
    ) {
      validateCreateOrUpdateUrl(req.body)
    } else if (
      req.originalUrl === '/delete_url' ||
      req.originalUrl === '/get_url'
    ) {
      validateDeleteOrGetUrl(req.body)
    } else if (
      req.originalUrl === '/add_tag' ||
      req.originalUrl === '/remove_tag'
    ) {
      validateAddOrRemoveTag(req.body)
    }

    // If validation passes, proceed to the next middleware
    next()
  } catch (error) {
    // Handle validation errors
    console.error(error)
    res.status(400).json({ error: 'Invalid Data' })
  }
}

function validateCreateOrUpdateUrl(data) {
  const { url, name, protocol, ignoreSSL } = data
  if (!url || !name || !protocol) {
    throw new Error('Invalid Data')
  }
  if (protocol === 'https' && ignoreSSL == null) {
    throw new Error('Invalid Data')
  }
}

function validateDeleteOrGetUrl(data) {
  const { id } = data
  if (!id) {
    throw new Error('Invalid Data')
  }
}

function validateAddOrRemoveTag(data) {
  const { id, tag } = data
  if (!id || !tag) {
    throw new Error('Invalid Data')
  }
}

module.exports = {
  auth,
  validate_data,
}
