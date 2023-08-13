const url_model = require('./url_model')

const WebhookNotifier = require('../notifier_modules/webhook_notifier')
const PushoverNotifier = require('../notifier_modules/pushover_notifier')
const EmailNotifier = require('../notifier_modules/email_notifier')

const {
  add_url_to_report,
  remove_url_from_report,
} = require('../reports/report_handler')

async function get_url(identifier, email) {
  try {
    console.log(identifier, email)
    const url = await url_model.findOne({ unique_id: identifier, email: email })
    if (!url) {
      throw new Error('No url found')
    }
    return url
  } catch (error) {
    throw error
  }
}

async function get_urls_by_ids(urls) {
  try {
    console.log(urls)
    const urls_recieved = await url_model.find({ unique_id: { $in: urls } })
    if (!urls_recieved) {
      throw new Error('No url found')
    }
    return urls_recieved
  } catch (error) {
    throw error
  }
}

async function create_url(url, email) {
  try {
    const new_url = new url_model(url)

    const notifier_object = { email: email }
    new_url.email = email
    new_url.email_notifier = notifier_object

    await add_url_to_report(new_url, email, 'all_reports')
    // intially all urls are added to all_reports tag
    // if user wants to add a url to a specific tag
    // he can do it from the url addtag api
    new_url.tags = ['all_reports']
    await new_url.save()
    const response = {
      url: new_url,
      notifier: notifier_object,
      id: new_url.unique_id,
    }
    return response
  } catch (error) {
    throw error
  }
}

async function update_url(identifier, url) {
  try {
    const updated_url = await url_model.findOneAndUpdate(
      { unique_id: identifier },
      url,
      { new: true }
    )
    if (!updated_url) {
      throw new Error('No url found')
    }
    const response = {
      url: new_url,
      id: new_url.unique_id,
    }
    return response
  } catch (error) {
    throw error
  }
}

async function delete_url(identifier) {
  try {
    const deleted_url = await url_model.findOneAndDelete({
      unique_id: identifier,
    })
    if (!deleted_url) {
      throw new Error('No url found')
    }

    // remove url from all reports
    for (tag of deleted_url.tags) {
      await remove_url_from_report(deleted_url, deleted_url.email, tag)
    }

    const response = {
      url: deleted_url,
      id: deleted_url.unique_id,
    }

    return response
  } catch (error) {
    throw error
  }
}

async function get_all_urls(email) {
  try {
    const urls = await url_model.find({ email: email })

    return urls
  } catch (error) {
    throw error
  }
}

async function set_notifier(id, notifier) {
  try {
    const url = await url_model.findOne({ unique_id: id })
    if (!url) {
      throw new Error('No url found')
    }
    console.log(notifier)
    switch (notifier.type) {
      case 'email':
        throw new Error(
          "Invalid notifier can't set email notifier to diffrent email"
        )
        break
      case 'webhook':
        const webhook_notifier = WebhookNotifier.getInstance()
        webhook_notifier.validateSettings(notifier.settings)
        url.webhook_notifier = notifier.settings
        break

      case 'pushover':
        const pushover_notifier = PushoverNotifier.getInstance()
        pushover_notifier.validateSettings(notifier.settings)
        url.pushover_notifier = notifier.settings
        break

      default:
        throw new Error('Invalid notifier')
    }
    await url.save()
    const response = {
      message: 'Notifier set successfully',
      id: url.unique_id,
    }
    return response
  } catch (error) {
    throw error
  }
}

async function add_tag(id, tag, email) {
  try {
    const url = await url_model.findOne({ unique_id: id })
    if (!url) {
      throw new Error('No url found')
    }

    if (url.tags.includes(tag)) {
      throw new Error('Tag already exists')
    }
    url.tags.push(tag)

    await add_url_to_report(url, email, tag)

    await url.save()
    const response = {
      message: 'Tag added successfully',
      id: url.unique_id,
    }
    return response
  } catch (error) {
    throw error
  }
}

async function remove_tag(id, tag, email) {
  try {
    const url = await url_model.findOne({ unique_id: id })
    if (!url) {
      throw new Error('No url found')
    }
    url.tags = url.tags.filter((e) => e != tag)
    remove_url_from_report(url, email, tag)
    await url.save()
    const response = {
      message: 'Tag removed successfully',
      id: url.unique_id,
    }
    return response
  } catch (error) {
    throw error
  }
}

async function update_url_stats(id, response) {
  const url = await url_model.findOne({ unique_id: id })

  if (
    response.status >= 200 &&
    response.status < 300 &&
    (url.assert == 0 || response.status == url.assert)
  ) {
    currState = 'UP'
    if (url.currState != currState) {
      url.currState = currState
      await notify_url(
        url,
        'url:' + url.url + 'with name:' + url.name + ' is UP'
      )
    }
    url.lastState = currState
    url.uptime += url.interval
    url.totalResponseTime += response.responseTime
    url.averageResponseTime = url.totalResponseTime / url.successfulChecks
    url.successfulChecks += 1
    url.availability =
      (url.successfulChecks / (url.successfulChecks + url.outages)) * 100

    url.history.push({
      status: response.status,
      responseTime: response.responseTime,
      time: Date.now(),
      desription: 'url is UP',
    })

    await url.save()
  } else {
    currState = 'DOWN'

    if (url.currState != currState) {
      url.currState = currState
      await notify_url(
        url,
        'url:' + url.url + 'with name:' + url.name + ' is DOWN'
      )
    }
    url.lastState = currState
    url.downtime += url.interval
    url.outages += 1
    url.availability =
      (url.successfulChecks / (url.successfulChecks + url.outages)) * 100
    url.history.push({
      status: response.status,
      responseTime: response.responseTime,
      time: Date.now(),
      desription: url.assert == 0 ? 'url is DOWN' : 'url assertion failed',
    })

    await url.save()
  }
}

async function notify_url(url, message) {
  if (url.email_notifier) {
    const email_notifier = EmailNotifier.getInstance()

    email_notifier.sendNotification(url.email_notifier, message)
  }
  if (url.webhook_notifier) {
    const webhook_notifier = WebhookNotifier.getInstance()

    webhook_notifier.sendNotification(url.webhook_notifier, message)
  }
  if (url.pushover_notifier) {
    const pushover_notifier = PushoverNotifier.getInstance()

    pushover_notifier.sendNotification(url.pushover_notifier, message)
  }
}

module.exports = {
  get_url,
  create_url,
  update_url,
  delete_url,
  get_all_urls,
  set_notifier,
  update_url_stats,
  add_tag,
  remove_tag,
  get_urls_by_ids,
}
