const { ping_url } = require('../utils/axios_utils')
const { update_url_stats } = require('./url_handler')

tasks = {}

function start_monitoring(url) {
  try {
    tasks[url.unique_id] = setInterval(async () => {
      try {
        console.log('pinging')
        const response = await ping_url(url)
        console.log(response)
        // console.log(response)
        await update_url_stats(url.unique_id, response)
      } catch (error) {
        console.log(error)
        return 0
      }
    }, 5000)
  } catch (error) {
    console.log(error)
  }
}

function stop_monitoring(url) {
  clearInterval(tasks[url.unique_id])
}

module.exports = {
  start_monitoring,
  stop_monitoring,
}
