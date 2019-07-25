const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    //contact details for author can be extracted from user schema
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }, //unique will not validate the values, it will just improve performance
  body: {
    type: String,
    required: true
  },
  date: {
    //at the time of post request, I will add the date = Date().toStiring() to get a more descriptive date and time
    type: String,
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
});

module.exports = mongoose.model('Comments', commentsSchema);
