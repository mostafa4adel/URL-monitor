const express = require('express')
const router = express.Router()

const { auth, validateTags } = require('./report_middleware')
const { get_report_by_tags } = require('./report_handler')

router.use('/', auth, validateTags)

router.get('/report', (req, res) => {
  tags = req.body.tags

  const email = req.email
  get_report_by_tags(tags, email)
    .then((report) => {
      res.json(report)
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ error: 'Invalid Data' })
    })
})

module.exports = router
