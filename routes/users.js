var express = require('express')
var router = express.Router()
let Blog = require('../modals/blog')
let Remark = require('../modals/remark')
const { all } = require('./remark')

/* GET users listing. */

// filter

router.get('/', (req, res, next) => {
  let obj = {}
  let { author } = req.query
  let { category } = req.query
  let { startDate } = req.query
  let { endDate } = req.query
  let { location } = req.query

  if (author) {
    obj.author = author
  } else if (category) {
    obj.category = category
  } else if (startDate) {
    obj.startDate = startDate
  } else if (endDate) {
    obj.endDate = endDate
  } else if (location) {
    obj.location = location
  }
  Blog.find(obj, (err, blog) => {
    if (err) return next(err)
    Blog.distinct('author', (err, unicAuthor) => {
      if (err) return next(err)
      Blog.distinct('category', (err, uniccategory) => {
        if (err) return next(err)
        Blog.distinct('startDate', (err, unicstartDate) => {
          if (err) return next(err)
          Blog.distinct('endDate', (err, unicEndDate) => {
            if (err) return next(err)
            Blog.distinct('location', (err, unicLocation) => {
              if (err) return next(err)
              res.render('blog', {
                blog,
                unicAuthor,
                uniccategory,
                unicstartDate,
                unicEndDate,
                unicLocation,
              })
            })
          })
        })
      })
    })
  })
})

// find a event form
router.get('/new', (req, res, next) => {
  res.render('event')
})

// find a singal page

router.get('/:id', (req, res, next) => {
  let id = req.params.id
  Blog.findById(id)
    .populate('remarks')
    .exec((err, blog) => {
      if (err) return next(err)
      console.log(blog)
      res.render('singalblog', { blog })
    })
})

//submit event

router.post('/', (req, res, next) => {
  Blog.create(req.body, (err) => {
    if (err) return next(err)
    Blog.find({}, (err, blog) => {
      if (err) return next(err)
      Blog.distinct('author', (err, unicAuthor) => {
        if (err) return next(err)
        Blog.distinct('category', (err, uniccategory) => {
          if (err) return next(err)
          Blog.distinct('startDate', (err, unicstartDate) => {
            if (err) return next(err)
            Blog.distinct('endDate', (err, unicEndDate) => {
              if (err) return next(err)
              Blog.distinct('location', (err, unicLocation) => {
                if (err) return next(err)
                res.render('blog', {
                  blog,
                  unicAuthor,
                  uniccategory,
                  unicstartDate,
                  unicEndDate,
                  unicLocation,
                })
              })
            })
          })
        })
      })
    })
  })
})

// edit event

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Blog.findById(id, (err, blog) => {
    if (err) return next(err)
    res.render('editEvent', { blog })
  })
})

// update event
router.post('/:id', (req, res, next) => {
  let id = req.params.id
  Blog.findByIdAndUpdate(id, req.body, { new: true }, (err, blog) => {
    if (err) return next(err)
    console.log(blog)
    res.render('singalblog', { blog })
  })
})

// delete blog

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Blog.findByIdAndDelete(id, (err, blog) => {
    if (err) return next(err)
    Remark.deleteMany({ blogId: blog.id }, (err, info) => {
      res.redirect('/users')
    })
  })
})

// likes

router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id
  Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, blog) => {
    res.redirect('/users/' + id)
  })
})

// dislike
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Blog.findById(id, (err, blog) => {
    if (err) return next(err)
    if (blog.likes > 0) {
      Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, blog) => {
        res.render('singalblog', { blog })
      })
    }
    res.redirect('/users/' + id)
  })
})

// add comments
router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id
  req.body.blogId = id
  Remark.create(req.body, (err, remark) => {
    if (err) return next(err)
    Blog.findByIdAndUpdate(
      id,
      { $push: { remarks: remark._id } },
      (err, blog) => {
        if (err) return next(err)
        res.redirect('/users/' + id)
      },
    )
  })
})

module.exports = router
