const axios = require('axios')
const https = require('https')

const ping_url = async (url_data) => {
  try {
    const startTime = Date.now()
    const response = await axios.get(
      url_data.protocol + '://' + url_data.url + url_data.path,
      {
        port: url_data.port ? url_data.port : 80,
        timeout: url_data.timeout * 1000,
        threshold: url_data.threshold,
        Headers: url_data.httpHeaders ? url_data.httpHeaders : null,
        httpsAgent: url_data.ignoreSSL
          ? new https.Agent({ rejectUnauthorized: false })
          : null,
        auth: url_data.authentication
          ? {
              username: url_data.authentication_username,
              password: url_data.authentication_password,
            }
          : null,
      }
    )
    const endTime = Date.now()

    const response_time = endTime - startTime
    const status_code = response.status
    const status_text = response.statusText

    return {
      response_time: response_time,
      status: status_code,
      status_text: status_text,
    }
  } catch (error) {
    console.log(error)
    return {
      response_time: null,
      status: null,
      status_text: null,
    }
  }
}

module.exports = {
  ping_url,
}
