import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from './config/config';
// import validate from '../utils/validate';
import User from '../models/user';

const router = express.Router();

router.post('/login', (req, res) => {
  // validates request body
  // const { errors, isValid } = validate.validateLogin(req.body);
  // if (!isValid) {
  //   return res.status(400).send(errors);
  // }
  const { email } = req.body;
  // checks the database for the user's username or email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          status: 400,
          message: 'User does not exists',
        });
      }
      // validates the user's password if user is found
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          {
            uuid: user.uuid,
            roleId: user.role,
            email: user.email,
          },
          config.jwtSecret,
        );
        return res.status(200).send({
          message: 'Authentication successful',
          token
        });
      }
      // returns error on invalid login
      return res.status(400).send({
        status: 400,
        message: 'Invalid credentials',
      });
    })
    .catch(error => res.status(400).send(error));
});

router.post('/logout', (req, res) => res
  .status(200).send({ status: 200 }));

export default router;
