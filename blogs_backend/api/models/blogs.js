const mongoose = require('mongoose');

const blogsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author_name: {
    type: String,
    required: true
  },
  author_email: {
    //contact details for author can be extracted from user schema
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }, //unique will not validate the values, it will just improve performance
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    //at the time of post request, I will add the date = Date().toStiring() to get a more descriptive date and time
    type: String,
    required: true
  },
  tags: {
    //String seperated by commas ','

    type: String,
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  comment_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comments',
    default: []
  }
});

module.exports = mongoose.model('Blogs', blogsSchema);
