const report_model = require('./report_model')
// const { get_urls_by_ids } = require('../urls/url_handler')
//disaster approach to fix the issue
//but I will take it for now
//when I have time I will fix it
const url_model = require('../urls/url_model')
//******************************************** */

async function add_url_to_report(url, email, tag) {
  try {
    let report = await report_model.findOne({ email, tag })

    if (!report) {
      console.log('No report found')
      report = await report_model.create({
        email,
        tag,
        url_arr: [url.unique_id],
      })
    } else {
      report.url_arr.push(url.unique_id)
      await report.save()
    }
  } catch (error) {
    throw error
  }
}

async function remove_url_from_report(url, email, tag) {
  try {
    console.log('remove_url_from_report')
    console.log(url, email, tag)
    const report = await report_model.findOne({ email, tag })
    if (report) {
      report.url_arr = report.url_arr.filter((e) => e != url.unique_id)
      await report.save()
    }
  } catch (error) {
    throw error
  }
}

async function get_report_by_tags(tags, email) {
  try {
    console.log(email, tags)
    const report = await report_model.find({ email, tag: { $in: tags } })
    console.log(report)
    for (const reportItem of report) {
      const urls = await url_model.find({
        unique_id: { $in: reportItem.url_arr },
      })
      reportItem.url_arr = urls
    }

    return report
  } catch (error) {
    throw error
  }
}

module.exports = {
  add_url_to_report,
  remove_url_from_report,
  get_report_by_tags,
}
