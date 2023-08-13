const router = require('express').Router()
const userRouter = require('./users/user_routes')
const urlRouter = require('./urls/url_routes')
const reportRouter = require('./reports/report_router')

router.use('/users', userRouter)
router.use('/urls', urlRouter)
router.use('/reports', reportRouter)

module.exports = router
