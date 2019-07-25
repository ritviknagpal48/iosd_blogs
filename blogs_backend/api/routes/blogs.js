const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const Blogs = require('../models/blogs');
const User = require('../models/user');

// //IOSD normal signup
// router.post('/signup', (req, res, next) => {
//   User.find({ email: req.body.email })
//     .exec()
//     .then(user => {
//       //Checking if same email exists or not
//       if (user.length >= 1) {
//         return res.status(422).json({
//           message: 'Mail already exists'
//         });
//       }

//       //hashing of password using bcrypt
//       else {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).json({
//               error: err
//             });
//           } else {
//             const user = new User({
//               _id: new mongoose.Types.ObjectId(),
//               name: req.body.name,
//               email: req.body.email,
//               password: hash
//             });
//             user
//               .save()
//               .then(result => {
//                 console.log(result);
//                 res.status(201).json({
//                   message: 'User Successfully Created'
//                 });
//               })
//               .catch(err => {
//                 console.log(err);
//                 res.status(500).json({
//                   error: err
//                 });
//               });
//           }
//         });
//       }
//     });
// });

router.get('/blogs', (req, res, next) => {
  Blogs.find()
    .exec()
    .then(data => {
      const response = {
        count: data.length,
        blogs: data.map(blog => {
          return {
            title: blog.title,
            _id: blog.id,
            body: blog.body,
            author_name: blog.author_name,
            author_email: blog.author_email,
            tags: blog.tags,
            date: blog.date,
            likes: blog.likes,
            comment_ids: blog.comment_ids
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/blogs', checkAuth, (req, res, next) => {
  const author_name = req.userData.name;
  const author_email = req.userData.email;
  const title = req.body.title;
  const body = req.body.body;
  const tags = req.body.tags;
  const date = Date().toString();
  if (!author_name || !author_email || !title || !body || !tags) {
    return res.status(500).json({
      message: 'Fields cannot be empty'
    });
  }
  User.find({ email: author_email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Invalid email'
        });
      }
      const blog = new Blogs({
        _id: new mongoose.Types.ObjectId(),
        author_name: author_name,
        author_email: author_email,
        title: title,
        body: body,
        tags: tags, //split it by ',' and then extract it
        date: date
      });
      blog
        .save()
        .then(ans => {
          console.log(ans);
          res.status(200).json({
            message: 'Blog successfully published',
            data: ans
          });
        })
        .catch(err => {
          return res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      error: err;
    });
});

router.patch('/blogs/:blogid', checkAuth, (req, res, next) => {
  const id = req.params.blogid;
  const updateBlogs = {};

  for (const x of req.body) {
    updateBlogs[x.propName] = x.value;
  }

  Blogs.update({ _id: id }, { $set: updateBlogs })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Blog updated successfully'
        // updated_blog: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

// router.post('/login', (req, res, next) => {
//   User.find({ email: req.body.email })
//     .exec()
//     .then(user => {
//       if (user.length < 1) {
//         return res.status(401).json({
//           message: 'User does not exist'
//         });
//       }
//       bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             message: 'Password is incorrect'
//           });
//         }
//         if (result) {
//           const token = jwt.sign(
//             {
//               email: user[0].email,
//               userId: user[0]._id,
//               name: user[0].name
//             },
//             process.env.JWT_KEY,
//             {
//               expiresIn: '3h'
//             }
//           );
//           return res.status(200).json({
//             message: 'Auth successful',
//             token: token
//           });
//         }
//         res.status(401).json({
//           message: 'Auth failed'
//         });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

//This route is added only to clear my db, no use in code

// router.delete('/:userId', checkAuth, (req, res, next) => {
//   //this allows any user to delete another user
//   User.remove({ _id: req.params.userId })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//         message: 'User deleted'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;
