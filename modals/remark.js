let mongoose = require('mongoose')
let Schema = mongoose.Schema
let Blog = require('../modals/blog')

let remarkSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Remark', remarkSchema)
