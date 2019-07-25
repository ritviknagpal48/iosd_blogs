const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const Blogs = require('../models/blogs');
const Comments = require('../models/comments');
const User = require('../models/user');

router.post('/blogs/addlike/:blogid', checkAuth, (req, res, next) => {
  console.log('before userData');
  console.log(req.userData);

  Blogs.find({ _id: req.params.blogid })
    .exec()
    .then(blog => {
      const final_data = {};
      //   console.log(blog);
      const likes_array = blog[0].likes;
      //   console.log(likes_array);
      likes_array.push(req.userData.userId);
      console.log(likes_array);

      //   console.log(final_data);
      Blogs.update({ _id: req.params.blogid }, { $set: { likes: likes_array } })
        .exec()
        .then(answer => {
          console.log(answer);
          return res.status(200).json({
            message: 'Number of likes added successfully'
          });
        })
        .catch(err1 => {
          return res.status(500).json({
            error: err1
          });
        });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router.post('/blogs/removelike/:blogid', checkAuth, (req, res, next) => {
  // console.log(req.userData);
  Blogs.find({ _id: req.params.blogid })
    .exec()
    .then(blog => {
      console.log('inside then');
      var likes_array = blog[0].likes;
      console.log(req.userData);
      console.log(likes_array);
      const index = likes_array.indexOf(req.userData.userId);
      likes_array.splice(index, 1);

      console.log(likes_array);
      Blogs.update({ _id: req.params.blogid }, { $set: { likes: likes_array } })
        .exec()
        .then(answer => {
          return res.status(200).json({
            no_of_likes: likes_array.length,
            message: 'No of likes removed successfully'
          });
        })
        .catch(err1 => {
          return res.status(500).json({
            error: err1
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/blogs/addcomment/:blogid', checkAuth, (req, res, next) => {
  Blogs.find({ _id: req.params.blogid })
    .exec()
    .then(blog => {
      const new_comment = new Comments({
        _id: new mongoose.Types.ObjectId(),
        user_name: req.userData.name,
        user_email: req.userData.email,
        body: req.body.data,
        date: Date().toString()
      });
      // console.log(new_comment);
      const comment_id = new_comment._id;
      new_comment
        .save()
        .then(ans => {
          console.log(ans);
          const blog_comments = blog[0].comment_ids;
          blog_comments.push(comment_id);
          Blogs.update(
            { _id: req.params.blogid },
            { $set: { comment_ids: blog_comments } }
          )
            .exec()
            .then(suc => {
              res.status(200).json({
                message: 'comments added successfully',
                data: suc
              });
            })
            .catch(err1 => {
              return res.status(500).json({
                error: err1
              });
            });
        })
        .catch();
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete(
  '/blogs/removecomment/:blogid/:comment_id',
  checkAuth,
  (req, res, next) => {
    Blogs.findOne({ _id: req.params.blogid })
      .exec()
      .then(blog => {
        const comments = blog.comment_ids;
        const index = comments.indexOf(req.params.comment_id);

        comments.splice(index, 1);

        Comments.remove({ _id: req.params.comment_id })
          .exec()
          .then(result => {
            console.log('Removed successfully');
            Blogs.update(
              { _id: req.params.blogid },
              { $set: { comment_ids: comments } }
            )
              .exec()
              .then(data => {
                console.log('Comments updated successfully in blogs');
                res.status(200).json({
                  message: 'Updated successfully'
                });
              })
              .catch(err1 => {
                res.status(500).json({
                  error: err1
                });
              });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
);
router.get(
  '/blogs/get_comment_by_id/:comment_id',
  checkAuth,
  (req, res, next) => {
    Comments.find({ _id: req.params.comment_id })
      .exec()
      .then(ans => {
        return res.status(200).json({
          message: 'Comment fetched successfully',
          data: ans[0]
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: err
        });
      });
  }
);

router.get('/blogs/getcomment_ids/:blogid', checkAuth, (req, res, next) => {
  Blogs.find({ _id: req.params.blogid })
    .exec()
    .then(blog => {
      return res.status(200).json({
        message: 'All comment ids fetched successfully',
        data: blog[0].comment_ids
      });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
});

router.put(
  '/blogs/edit_comment_body/:commentid',
  checkAuth,
  (req, res, next) => {
    Comments.update(
      { _id: req.params.commentid },
      { $set: { body: req.body.data } }
    )
      .exec()
      .then(final => {
        res.status(200).json({
          message: 'Comment successfully updated',
          data: final
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
);
router.post(
  '/blogs/add_comment_like/:commentid',
  checkAuth,
  (req, res, next) => {
    Comments.findOne({ _id: req.params.commentid })
      .exec()
      .then(comment => {
        console.log(comment);
        const likes_array = comment.likes;
        likes_array.push(req.userData.userId);
        Comments.update(
          { _id: req.params.commentid },
          { $set: { likes: likes_array } }
        )
          .exec()
          .then(ans => {
            return res.status(200).json({
              message: 'Comment like added successfully',
              data: ans
            });
          })
          .catch(err1 => {
            return req.status(500).json({
              error: err1
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
);

router.post(
  '/blogs/delete_comment_like/:commentid',
  checkAuth,
  (req, res, next) => {
    Comments.findOne({ _id: req.params.commentid })
      .then(comment => {
        const likes_array = comment.likes;
        const index = likes_array.indexOf(req.userData.userId);
        likes_array.splice(index, 1);
        Comments.update(
          { _id: req.params.commentid },
          {
            $set: {
              likes: likes_array
            }
          }
        )
          .exec()
          .then(ans => {
            res.status(200).json({
              message: 'Comment like removed successfully',
              data: ans
            });
          })
          .catch(err1 => {
            res.status(500).json({
              error: err1
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
);

module.exports = router;
