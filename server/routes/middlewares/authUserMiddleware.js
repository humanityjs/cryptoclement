import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../../models/user';

// checks for authorization header in request
// and sends the user to the next route or throws error
export default (req, res, next) => {
  const authToken = req.headers.authorization;
  let token;
  if (authToken) {
    token = authToken.split(' ')[1];
  }
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({
          message: 'Authorization failed'
        });
      } else {
        const { email } = decoded;
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                message: 'User not found'
              });
            }
            req.authenticatedUser = {};
            req.authenticatedUser.first_name = user.first_name;
            req.authenticatedUser.last_name = user.last_name;
            req.authenticatedUser.role = user.role;
            req.authenticatedUser.email = user.email;
            req.authenticatedUser.uuid = user.uuid;
            req.authenticatedUser.tfa = decoded.tfa;
            next();
          });
      }
    });
  } else {
    res.status(403).json({
      message: 'No token provided'
    });
  }
};
