let express = require('express')
let router = express.Router()

let Blog = require('../modals/blog')
let Remark = require('../modals/remark')

// like

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id
  // console.log(id)
  Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, blog) => {
    console.log(blog)
    if (err) return next(err)
    res.redirect('/users/' + blog.blogId)
  })
})

// dislike

router.get('/:id/dislikes', (req, res, next) => {
  let id = req.params.id
  Remark.findById(id, (err, remark) => {
    if (err) return next(err)
    if (remark.likes > 0) {
      Remark.findByIdAndUpdate(
        id,
        { $inc: { likes: -1 } },
        { new: true },
        (err, blog) => {
          if (err) return next(err)
          res.redirect('/users/' + blog.blogId)
        },
      )
    } else {
      res.redirect('/users/' + remark.blogId)
    }
  })
})

// delete comment
// router.get('/:id/delete', (req, res, next) => {
//   let id = req.params.id
//   Remark.findByIdAndDelete(id, (err, remark) => {
//     if (err) return next(err)
//     res.redirect('/users/' + remark.blogId)
//   })
// })

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Remark.findByIdAndRemove(id, (err, remark) => {
    if (err) return next(err)
    // console.log(remark)
    Blog.findByIdAndUpdate(
      remark.blogId,
      { $pull: { remarks: remark._id } },
      (err, blog) => {
        res.redirect('/users/' + remark.blogId)
      },
    )
  })
})

module.exports = router
