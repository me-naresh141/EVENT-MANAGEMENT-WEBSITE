let mongoose = require('mongoose')
let Schema = mongoose.Schema

let blogSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    author: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number },
    remarks: [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Blog', blogSchema)
