import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import generator from 'generate-password';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import uuidV1 from 'uuid/v1';
import Earning from '../models/earnings';
import Site from '../models/sites';
import History from '../models/history';
import User from '../models/user';
import config from './config/config';
import authUserMiddleware from './middlewares/authUserMiddleware';

dotenv.config();

const helper = require('sendgrid').mail;

const { SENDGRID_API_KEY } = process.env;
const sg = require('sendgrid')(SENDGRID_API_KEY);

const router = express.Router();

router.post('/', (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  const uuid = uuidV1();
  const hashedPassword = bcrypt.hashSync(password);
  const { email } = req.body;
  if (!password || !email) {
    return res.status(400).send({
      message: 'Please fill all fields'
    });
  }
  User.findOne({
    email
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: 'user already exists'
      });
    }
    User.create({ email, password: hashedPassword, uuid })
      .then((newUser) => {
        const message = `<h4>Hi there</h4>
            <p>Welcome to BTC Grinders.</p>
            <p>Here is your password for future reference: ${password}.</p>
            <p>Thank you!</p>
          `;
        const fromEmail = new helper.Email('no-reply@btcgrinders.com');
        const toEmail = new helper.Email(email);
        const subject = 'Welcome to BTC Grinders';
        const content = new helper.Content('text/html', message);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        sg.API(request, (error) => {
          if (error) {
            return res.status(400).send({
              error
            });
          }

          const token = jwt.sign(
            {
              uuid: newUser.uuid,
              roleId: newUser.role,
              email: newUser.email
            },
            config.jwtSecret
          );

          return res.status(200).send({
            message: 'Registration successful',
            token
          });
        });
      })
      .catch(err => res.status(400).send(err));
  });
});

router.get('/dashboard', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  Earning.find({ email }).then((earnings) => {
    Site.find({ email }).then((sites) => {
      History.find({ email }).then((histories) => {
        const balances = {
          usd: 0,
          btc: 0,
          ltc: 0,
          eth: 0,
          bch: 0,
          dash: 0
        };
        earnings.forEach((earning) => {
          balances[earning.type] = earning.amount;
        });
        return res.status(200).send({
          user: req.authenticatedUser,
          earnings: balances,
          sites,
          histories
        });
      });
    });
  });
});

router.post('/site', authUserMiddleware, (req, res) => {
  const {
    email, username, siteName, siteType
  } = req.body;
  const id = uuidV1();
  Site.findOne({
    email,
    username,
    site_name: siteName,
    site_type: siteType
  }).then((site) => {
    if (!site) {
      User.findOne({ email }).then((user) => {
        if (!user) {
          const password = generator.generate({
            length: 10,
            numbers: true
          });
          const hashedPassword = bcrypt.hashSync(password);
          User.create({
            email,
            password: hashedPassword
          }).then((newUser) => {
            Site.create({
              id,
              email,
              username,
              site_type: siteType,
              site_name: siteName
            }).then(() => {
              const message = `<h4>Hi there</h4>
                      <p>Welcome to BTC Grinders.</p>
                      <p>Here is your password for future reference: ${password}.</p>
                      <p>Thank you!</p>
                    `;
              const fromEmail = new helper.Email('no-reply@btcgrinders.com');
              const toEmail = new helper.Email(email);
              const subject = 'Welcome to BTC Grinders';
              const content = new helper.Content('text/html', message);
              const mail = new helper.Mail(
                fromEmail,
                subject,
                toEmail,
                content
              );
              const request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
              });

              sg.API(request, (error) => {
                if (error) {
                  return res.status(400).send({
                    error
                  });
                }
                const token = jwt.sign(
                  {
                    uuid: newUser.uuid,
                    roleId: newUser.role,
                    email: newUser.email
                  },
                  config.jwtSecret
                );

                return res.status(200).send({
                  message: 'User added successfully',
                  token,
                  type: 'new'
                });
              });
            });
          });
        } else {
          Site.create({
            id,
            email,
            username,
            site_type: siteType,
            site_name: siteName
          }).then(() =>
            res.status(200).send({
              message: 'Site registered successfully',
              type: 'old'
            }));
        }
      });
    } else {
      return res.status(400).send({
        message: 'You have already registered this site on our website'
      });
    }
  });
});

export default router;
