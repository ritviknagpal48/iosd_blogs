const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');
const blogRoutes = require('./api/routes/blogs');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  'mongodb+srv://ritviknagpal48:' +
    process.env.MONGO_ATLAS_PW +
    '@testingapi-yy853.mongodb.net/test?retryWrites=true&w=majority',
  {
    useMongoClient: true
  }
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/', require('./api/routes/comments'));
app.use('/api', blogRoutes);
app.use('/user', userRoutes);

// app.use((req, res, next) => {
//   const error = new Error('Not found, Please try another link');
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message
//     }
//   });
// });

module.exports = app;
