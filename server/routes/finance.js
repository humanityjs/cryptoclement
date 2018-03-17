import express from 'express';
import uuidV1 from 'uuid/v1';
import Earning from '../models/earnings';
import History from '../models/history';
import Payout from '../models/payouts';
import authUserMiddleware from './middlewares/authUserMiddleware';

const router = express.Router();

router.get('/earnings', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  Earning.find({ email }).then(earnings => res.status(200).send({
    earnings
  }))
    .catch(err => res.status(500).send({ err }));
});

router.post('/earnings', authUserMiddleware, (req, res) => {
  const { role } = req.authenticatedUser;
  if (role !== 1) {
    return res.status(401)
      .send({ message: 'You are not authorized to perform this action' });
  }
  const { siteName } = req.body;
  const { email } = req.body;
  const { siteType } = req.body;
  const type = req.body.type.toLowerCase();
  const { username } = req.body;
  const { amount } = req.body;
  const id = uuidV1();

  Earning.findOne({ email, type }).then((earn) => {
    if (earn) {
      const newAmount = parseFloat(earn.amount) + parseFloat(amount);
      Earning.update({ email, type }, { amount: newAmount }).then(() => {
        History.create({
          id, username, email, amount, amountType: type, type: 'disbursement'
        }).then(() => res.status(200)
          .send({ message: 'Request submitted successfully! ' }))
          .catch(err => res.status(400).send({
            message: 'Sorry an error occured',
            err
          }));
      }).catch(err => res.status(400).send({
        message: 'Sorry an error occured',
        err
      }));
    } else {
      Earning.create({
        id,
        email,
        amount,
        type,
        username,
        site_name: siteName,
        site_type: siteType
      }).then(() => {
        History.create({
          id,
          username: email,
          email,
          amount,
          amountType: type,
          type: 'disbursement'
        }).then(() => res.status(200)
          .send({ message: 'Request submitted successfully! ' }))
          .catch(err => res.status(400).send({
            message: 'Sorry an error occured',
            err
          }));
      }).catch(err => res.status(400).send({
        message: 'Sorry an error occured',
        err
      }));
    }
  });
});

router.post('/convert', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  const { amount } = req.body;
  const id = uuidV1();
  if (amount < 35) {
    return res.status(400).send({ message: 'Miminum withdrawal is $35' });
  }
  const { value } = req.body;
  const type = req.body.type.toLowerCase();
  Earning.findOne({ email, type: 'usd' }).then((earning) => {
    if (!earning) {
      return res.status(400)
        .send({ message: 'You do not have money in your USD wallet yet!' });
    }
    if (amount > earning.amount) {
      return res.status(400)
        .send({ message: 'You do not have enough balance to convert' });
    }
    const newUsd = earning.amount - amount;
    Earning.update({ email, type: 'usd' }, { amount: newUsd }).then(() => {
      Earning.findOne({ email, type }).then((earn) => {
        if (earn) {
          const newAmount = earn.amount + value;
          Earning.update({ email, type }, { amount: newAmount }).then(() => {
            History.create({
              id,
              username: email,
              email,
              amount,
              amountType: type,
              type: 'conversion',
              value: value.toFixed(10)
            })
              .then(() => res.status(200)
                .send({ message: 'Request submitted successfully! ' }));
          });
        } else {
          Earning.create({ email, amount: value, type }).then(() => {
            History.create({
              id,
              username: email,
              email,
              amount,
              amountType: type,
              type: 'conversion',
              value: value.toFixed(10)
            })
              .then(() => res.status(200)
                .send({ message: 'Request submitted successfully! ' }));
          });
        }
      });
    });
  });
});

router.post('/payout', authUserMiddleware, (req, res) => {
  const { email } = req.authenticatedUser;
  const { amount, address } = req.body;
  const type = req.body.type.toLowerCase();
  const id = uuidV1();
  Earning.findOne({ email, type }).then((earning) => {
    if (earning) {
      if (amount > earning.amount) {
        return res.status(400)
          .send({
            message: `You do not have sufficient
              balance to perform this operation`
          });
      }
      const newBalance = earning.amount - amount;
      Earning.update({ email, type }, { amount: newBalance }).then(() => {
        Payout.create({
          id,
          email,
          amount,
          type,
          address
        }).then(() => {
          History.create({
            id,
            username: email,
            email,
            amount,
            amountType: type,
            type: 'payout',
            value: 0
          })
            .then(() => res.status(200)
              .send({ message: 'Request submitted successfully! ' }));
        });
      });
    } else {
      return res.status(400)
        .send({ message: `You dont have money in your ${type} wallet.` });
    }
  });
});

export default router;
