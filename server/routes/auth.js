import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from './config/config';
// import validate from '../utils/validate';
import User from '../models/user';
import authUserMiddleware from './middlewares/authUserMiddleware';

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

router.post('/change-password', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  const { newPass, currentPass } = req.body;
  const hashPassword = bcrypt.hashSync(newPass.toString());
  User.findOne({ email })
    .then((user) => {
      if (!bcrypt.compareSync(currentPass, user.password)) {
        return res.status(400).send({
          message: 'Your current password is wrong. Please try again.'
        });
      }
      User.update({ email }, { password: hashPassword })
        .then(() => res.status(200).send({ message: 'Password updated' }))
        .catch(err => res.status(400).send({ err }));
    });
});

router.post('/logout', (req, res) => res
  .status(200).send({ status: 200 }));

export default router;
