const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Define the schema
const ReportSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  url_arr: [
    {
      type: String,
      ref: 'url',
    },
  ],
})

// Apply the uniqueValidator plugin
ReportSchema.plugin(uniqueValidator, {
  message: 'Error, expected report to be unique.',
})
ReportSchema.index({ email: 1, tag: 1 }, { unique: true })

// Create a Mongoose model using the schema
const report_model = mongoose.model('Report', ReportSchema)

// Export the model
module.exports = report_model
