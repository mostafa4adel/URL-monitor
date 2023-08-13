const router = require('express').Router()
const { auth, validate_data } = require('./url_middleware')
const {
  get_url,
  create_url,
  update_url,
  delete_url,
  get_all_urls,
  set_notifier,
  add_tag,
  remove_tag,
} = require('./url_handler')
const { start_monitoring, stop_monitoring } = require('./url_monitoring')

// Middleware for authentication and data validation
router.use('/', auth)
router.use('/', validate_data)

// Helper function for handling errors
const handleErrorResponse = (res, error) => {
  console.error(error)
  res.status(400).json({ error: 'Invalid Data' })
}

router.post('/get_url', async (req, res) => {
  try {
    const url_id = req.body.id
    const url = await get_url(url_id, req.email)
    res.json(url)
  } catch (error) {
    handleErrorResponse(res, error)
  }
})

router.post('/delete_url', async (req, res) => {
  try {
    const url_id = req.body.id
    if (!url_id) {
      return res.status(400).json({ error: 'Invalid Data' })
    }
    const url = await delete_url(url_id)

    res.json(url)
  } catch (error) {
    handleErrorResponse(res, error)
  }
})
const handleResponse = async (promise, res) => {
  try {
    const result = await promise
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid Data' })
  }
}

router.get('/get_all_urls', (req, res) => {
  handleResponse(get_all_urls(req.email), res)
})

router.post('/create_url', (req, res) => {
  handleResponse(create_url(req.body, req.email), res)
})

router.post('/add_tag', (req, res) => {
  handleResponse(add_tag(req.body.id, req.body.tag, req.email), res)
})
const handleResponseWithErrorHandling = async (
  promise,
  res,
  successMessage
) => {
  try {
    const result = await promise()
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid Data' })
  }
}

router.post('/remove_tag', (req, res) => {
  handleResponseWithErrorHandling(
    () => remove_tag(req.body.id, req.body.tag, req.email),
    res
  )
})

router.post('/update_url', (req, res) => {
  handleResponseWithErrorHandling(() => update_url(req.body.id, req.body), res)
})

router.post('/set_notifier', (req, res) => {
  handleResponseWithErrorHandling(
    () => set_notifier(req.body.id, req.body.notifier),
    res
  )
})

router.post('/start_monitoring', async (req, res) => {
  handleResponseWithErrorHandling(() => {
    return new Promise(async (resolve, reject) => {
      const url_id = req.body.id
      const url = await get_url(url_id, req.email)

      if (!url) {
        res.status(400).json({ error: 'Invalid Data' })
        reject('Invalid Data')
        return
      }

      start_monitoring(url)
      res.json({ message: 'Monitoring Started' })
      resolve()
    })
  }, res)
})

router.post('/stop_monitoring', async (req, res) => {
  handleResponseWithErrorHandling(() => {
    return new Promise(async (resolve, reject) => {
      const url_id = req.body.id
      const url = await get_url(url_id)

      if (!url) {
        res.status(400).json({ error: 'Invalid Data' })
        reject('Invalid Data')
        return
      }

      stop_monitoring(url)
      res.json({ message: 'Monitoring Stopped' })
      resolve()
    })
  }, res)
})

module.exports = router
