import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import config from './config/config';
// import validate from '../utils/validate';
import User from '../models/user';
import Tfa from '../models/tfa';
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
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        // returns error on invalid login
        return res.status(400).send({
          status: 400,
          message: 'Invalid credentials',
        });
      }
      Tfa.findOne({ email })
        .then((tfauser) => {
          if (!tfauser) {
            const token = jwt.sign(
              {
                uuid: user.uuid,
                roleId: user.role,
                email: user.email,
                tfa: false
              },
              config.jwtSecret,
            );
            return res.status(200).send({
              message: 'Authentication successful',
              token,
              tfa: false
            });
          }

          return res.status(200).send({
            message: 'Please generate a 2fa with your device',
            tfa: true,
            email
          });
        });
    })
    .catch(error => res.status(400).send(error));
});

router.post('/login-2fa', (req, res) => {
  const { tfatoken, email } = req.body;
  if (!tfatoken) {
    return res.status(400).send({
      message: 'Token is required'
    });
  }
  Tfa.findOne({ email }).then((tfauser) => {
    const verified = speakeasy.totp.verify({
      secret: tfauser.secret,
      encoding: 'base32',
      token: tfatoken
    });

    if (!verified) {
      return res.status(400).send({
        message: 'Unable to verify token. Please generate a new one.'
      });
    }
    User.findOne({ email }).then((user) => {
      const token = jwt.sign(
        {
          uuid: user.uuid,
          roleId: user.role,
          email: user.email,
          tfa: true
        },
        config.jwtSecret,
      );
      return res.status(200).send({
        message: 'Authentication successful',
        token,
        tfa: false
      });
    });
  });
});

router.post('/disable-2fa', authUserMiddleware, (req, res) => {
  const { email, tfa } = req.authenticatedUser;
  if (!tfa) {
    return res.status(400).send({
      message: 'You do not have Two factor authentication enabled'
    });
  }
  Tfa.deleteOne({ email }).then(() => {
    User.findOne({ email }).then((user) => {
      const token = jwt.sign(
        {
          uuid: user.uuid,
          roleId: user.role,
          email: user.email,
          tfa: false
        },
        config.jwtSecret,
      );
      return res.status(200).send({
        message: 'Two factor authentication deactivated successfully',
        token,
        tfa: false
      });
    });
  });
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

router.post('/generate-2fa', authUserMiddleware, (req, res) => {
  const secret = speakeasy.generateSecret({ length: 10 });
  const { email } = req.authenticatedUser;
  QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
    Tfa.findOne({ email }).then((existing) => {
      if (existing) {
        return res.status(400).send({
          message: 'You already have 2fa enabled'
        });
      }
      Tfa.create({
        email,
        tempSecret: secret.base32,
        dataURL,
        otpURL: secret.otpauth_url
      }).then(() => res.status(200).send({
        message: 'Verify OTP',
        tempSecret: secret.base32,
        dataURL,
        otpURL: secret.otpauth_url
      })).catch(err => res.status(500).send({ err }));
    });
  });
});

router.post('/verify-2fa', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  const { token } = req.body;
  if (!token) {
    return res.status(400).send({
      message: 'Token is required'
    });
  }
  Tfa.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).send({
        message: 'You do not have 2fa enabled. Please try again.'
      });
    }
    const verified = speakeasy.totp.verify({
      secret: user.tempSecret, // secret of the logged in user
      encoding: 'base32',
      token
    });
    if (!verified) {
      return res.status(400).send('Invalid token, verification failed');
    }
    Tfa.update({ email }, { secret: user.tempSecret })
      .then(() => {
        User.findOne({ email }).then((user) => {
          const tokenSigned = jwt.sign(
            {
              uuid: user.uuid,
              roleId: user.role,
              email: user.email,
              tfa: true
            },
            config.jwtSecret,
          );
          return res.status(200).send({
            message: 'Authentication successful',
            token: tokenSigned,
            tfa: true
          });
        });
      })
      .catch(err => res.status(400).send({ err }));
  });
});

router.post('/logout', (req, res) => res
  .status(200).send({ status: 200 }));

export default router;
