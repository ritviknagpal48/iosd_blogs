const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('inside check-auth');
  try {
    const token = req.headers.authorization.split(' ')[1]; //token is sent from header with "Bearer <token>"
    console.log(token); //as we are accessing token from header, we dont need a parser for form-type data

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    console.log(req.userData);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed here'
    });
  }
};
