const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');
const Earning = require('./models/earnings');
const History = require('./models/history');
const Payout = require('./models/payouts');
const Site = require('./models/sites');
var FileStore = require('session-file-store')(session);
const helper = require('sendgrid').mail;

const SENDGRID_API_KEY = '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'
const sg = require('sendgrid')(SENDGRID_API_KEY);

const MONGO_URL = 'mongodb://clement:clement_crypto@ds245478.mlab.com:45478/clement_crypto';

mongoose.connect(MONGO_URL);

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const PORT = process.env.PORT || 5000;

const publicPath = path.join(__dirname, '../client/');

app.use(cookieParser());
app.use(session(
  {
    store: new FileStore,
    secret: process.env.SESSION_SECRET || 'jhjhjhjhjhjhj',
    cookie: {},
    saveUninitialized: false,
    resave: false
  }
));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/', express.static(publicPath))

app.post('/users', (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  const hashedPassword = bcrypt.hashSync(password);
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).send({
      message: 'Please fill all fields'
    });
  }
  User.findOne({
    email: email
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: 'user already exists'
      });
    }
    User.create({ email: email, password: hashedPassword })
      .then((user) => {
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

        sg.API(request, (error, response) => {
          if (error) {
            return res.status(400).send({
              error
            });
          }
          req.session.user = { email: user.email, role: user.role };
          return res.status(200).send({
            message: 'User added successfully'
          });
        });
      })
      .catch((err) => {
        return res.status(400).send(err)
      })
  })
})

app.post('/payout', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(400).send({ message: 'You are not logged in' });
  }
  const email = user.email;
  const amount = req.body.amount;
  const type = req.body.type.toLowerCase();
  const id = generator.generate({
    length: 20,
    numbers: true
  });
  const address = req.body.address;
  Earning.findOne({ email: email, type: type }).then((earning) => {
    console.log(earning, 'earning')
    if (earning) {
      if (amount > earning.amount) {
        return res.status(400).send({ message: 'You do not have sufficient balance to perform this operation' });
      }
      const newBalance = earning.amount - amount;
      Earning.update({ email: email, type: type }, { amount: newBalance }).then(() => {
        Payout.create({
          id: id,
          email: email,
          amount: amount,
          type: type,
          address: address
        }).then(() => {
          return res.status(200).send({ message: 'Request successful' });
        })
      })
    } else {
      return res.status(400).send({ message: `You dont have money in your ${type} wallet.` })
    }
  })
});

app.post('/add-site', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const site_name = req.body.site_name;
  const site_type = req.body.site_type;
  const id = generator.generate({
    length: 20,
    numbers: true
  });
  Site.findOne({ email: email, username: username, site_name: site_name, site_type: site_type })
    .then((site) => {
      if (!site) {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              const password = generator.generate({
                length: 10,
                numbers: true
              });
              const hashedPassword = bcrypt.hashSync(password);
              User.create({
                email: email,
                password: hashedPassword
              }).then((user) => {
                Site.create({
                  id: id,
                  email: email,
                  username: username,
                  site_type: site_type,
                  site_name: site_name
                })
                  .then(() => {
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

                    sg.API(request, (error, response) => {
                      if (error) {
                        return res.status(400).send({
                          error
                        });
                      }
                      req.session.user = { email: user.email, role: user.role };
                      return res.status(200).send({ message: 'Site registered successfully', type: 'new' });
                    });
                  })
              })
            } else {
              Site.create({
                id: id,
                email: email,
                username: username,
                site_type: site_type,
                site_name: site_name
              })
                .then(() => {
                  return res.status(200).send({ message: 'Site registered successfully', type: 'old' });
                })
            }
          })
      } else {
        return res.status(400).send({ message: 'You have already registered this site on our website' });
      }
    })
});


app.get('/', (req, res) => {
  req.session.currentPage = 'poker';
  const user = req.session.user;
  res.render('pages/index', { page: 'poker', currentPage: 'poker', user: user });
});

app.get('/earnings', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(400).send({ message: 'You are not logged in' });
  }
  Earning.find({ email: user.email }).then((earnings) => {
    return res.send()
  })
});

app.post('/confirm-payment', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(400).send({ message: 'You are not logged in' });
  }
  if (user.role !== 1) {
    return res.status(401).send({ message: 'You are not authorized to perform this action' })
  }
  const id = req.body.id;
  Payout.findOne({ id: id }).then((payout) => {
    if (!payout) {
      return res.status(400).send({ message: 'Cannot find a payout with that id' });
    } else {
      Payout.update({ id: id }, { status: 1 }).then(() => {
        return res.status(200).send({ message: 'Payment request confirmed successfully' })
      });
    }
  })
})

app.post('/earnings', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(400).send({ message: 'You are not logged in' });
  }
  if (user.role !== 1) {
    return res.status(401).send({ message: 'You are not authorized to perform this action' })
  }
  const site_name = req.body.site_name;
  const email = req.body.email;
  const site_type = req.body.site_type;
  const type = req.body.type.toLowerCase();
  const username = req.body.username;
  const amount = req.body.amount;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(400).send({
        message: 'User with that email does not exist. Please check the email and try again'
      })
    }
    Earning.findOne({ email: email, type: type }).then((earn) => {
      if (earn) {
        const newAmount = parseFloat(earn.amount) + parseFloat(amount);
        Earning.update({ email: email, type: type }, { amount: newAmount }).then(() => {
          History.create({ username: username, email: email, amount: amount, amountType: type, type: 'disbursement' }).then(() => {
            return res.status(200).send({ message: 'Request submitted successfully! ' });
          }).catch((err) => {
            return res.status(400).send({
              message: 'Sorry an error occured',
              err: err
            })
          })
        }).catch((err) => {
          return res.status(400).send({
            message: 'Sorry an error occured',
            err: err
          })
        })
      } else {
        Earning.create({ email: email, amount: amount, type: type, username: username, site_name: site_name, site_type: site_type }).then(() => {
          History.create({ username: email, email: email, amount: amount, amountType: type, type: 'conversion' }).then(() => {
            return res.status(200).send({ message: 'Request submitted successfully! ' });
          }).catch((err) => {
            return res.status(400).send({
              message: 'Sorry an error occured',
              err: err
            })
          })
        }).catch((err) => {
          return res.status(400).send({
            message: 'Sorry an error occured',
            err: err
          })
        })
      }
    })
  })
})

app.post('/convert', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(400).send({ message: 'You are not logged in' });
  }
  const amount = req.body.amount;
  if (amount < 35) {
    return res.status(400).send({ message: 'Miminum withdrawal is $35' });
  }
  const value = req.body.value;
  const type = req.body.type.toLowerCase();
  Earning.findOne({ email: user.email, type: 'usd' }).then((earning) => {
    if (earning) {
      if (amount > earning.amount) {
        return res.status(400).send({ message: 'You do not have enough balance to convert' });
      }
      const newUsd = earning.amount - amount;
      Earning.update({ email: user.email, type: 'usd' }, { amount: newUsd }).then(() => {
        Earning.findOne({ email: user.email, type: type }).then((earn) => {
          if (earn) {
            const newAmount = earn.amount + value;
            Earning.update({ email: user.email, type: type }, { amount: newAmount }).then(() => {
              History.create({ username: user.email, email: user.email, amount: amount, amountType: 'usd', type: 'conversion' }).then(() => {
                return res.status(200).send({ message: 'Request submitted successfully! ' });
              })
            })
          } else {
            Earning.create({ email: user.email, amount: value, type: type }).then(() => {
              History.create({ username: user.email, email: user.email, amount: amount, amountType: 'usd', type: 'conversion' }).then(() => {
                return res.status(200).send({ message: 'Request submitted successfully! ' });
              })
            })
          }
        })
      })
    }
    return res.status(400).send({ message: 'You do not have money in your USD wallet yet!' })
  })
})

app.get('/dashboard', (req, res) => {
  console.log(req.session);
  res.setHeader("Content-Type", "text/html")
  const isAuthenticated = req.session.isAuthenticated;
  const user = req.session.user;
  if (!user) {
    res.redirect('/');
  } else {
    Earning.find({ email: user.email }).then((earnings) => {
      Site.find({ email: user.email }).then((sites) => {
        History.find({ email: user.email }).then((histories) => {
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
          res.render('pages/dashboard', {
            page: 'dashboard',
            currentPage: 'dashboard',
            user: user,
            earnings: balances,
            sites: sites,
            histories: histories
          });
        })
      })
    })
  }
});

app.get('/admin', (req, res) => {
  console.log(req.session);
  res.setHeader("Content-Type", "text/html")
  const isAuthenticated = req.session.isAuthenticated;
  const user = req.session.user;
  if (user && user.role === 1) {
    Payout.find().then((payouts) => {
      Site.find().then((sites) => {
        res.render('pages/admin', { page: 'admin', currentPage: 'admin', user: user, payouts: payouts, sites: sites });
      })
    });
  } else {
    res.redirect('/');
  }
});

app.post('/confirm-site', (req, res) => {
  const isAuthenticated = req.session.isAuthenticated;
  const user = req.session.user;
  if (user.role !== 1) {
    return res.status(400).send({ message: 'You are not authorised to perform this action' })
  }
  const id = req.body.id;
  const status = req.body.status;
  Site.findOne({ id: id }).then((site) => {
    if (!site) {
      return res.status(404).send({ message: 'Unable to find that entry' })
    }
    Site.update({ id: id }, { status: status }).then(() => {
      return res.status(200).send({ message: 'Status updated successfully' });
    })
  })
})

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/')
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'User does not exists' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = { email: user.email, role: user.role };
        return res.status(200).send({ message: 'Authentication successful', user: user });
      }
      return res.status(400).send({ message: 'Invalid credentials' });
    })
})

app.get('/americas-cardroom', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/americas-cardroom', { page: 'americas-cardroom', currentPage: currentPage, user: user });
});

app.get('/betonline', (req, res) => {
  console.log(req.session)
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/betonline', { page: 'betonline', currentPage: currentPage, user: user });
});

app.get('/blackchip-poker', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/blackchip-poker', { page: 'blackchip-poker', currentPage: currentPage, user: user });
});

app.get('/blog', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/blog', { page: 'blog', currentPage: currentPage, user: user });
});

app.get('/contact', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/contact', { page: 'contact', currentPage: currentPage, user: user });
});

app.get('/faq', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/faq', { page: 'faq', currentPage: currentPage, user: user });
});

app.get('/forgot-pas', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/forgot-pas', { page: 'forgot-pas', currentPage: currentPage, user: user });
});

app.get('/intertoops', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/intertoops', { page: 'intertoops', currentPage: currentPage, user: user });
});

app.get('/login', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/login', { page: 'login', currentPage: currentPage, user: user });
});

app.get('/nitrogensports', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/nitrogensports', { page: 'nitrogensports', currentPage: currentPage, user: user });
});

app.get('/register', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/register', { page: 'register', currentPage: currentPage, user: user });
});

app.get('/single', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/single', { page: 'single', currentPage: currentPage, user: user });
});

app.get('/sports', (req, res) => {
  req.session.currentPage = 'sports';
  const user = req.session.user;
  res.render('pages/sports', { page: 'sports', currentPage: 'sports', user: user });
});

app.get('/swc', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/swc', { page: 'swc', currentPage: currentPage, user: user });
});

app.get('/tos', (req, res) => {
  const currentPage = req.session.currentPage;
  const user = req.session.user;
  res.render('pages/tos', { page: 'tos', currentPage: currentPage, user: user });
});

app.get('/tools', (req, res) => {
  req.session.currentPage = 'tools';
  const user = req.session.user;
  res.render('pages/tools', { page: 'tools', currentPage: 'tools', user: user });
});

app.get('/trading', (req, res) => {
  req.session.currentPage = 'trading';
  const user = req.session.user;
  res.render('pages/trading', { page: 'trading', currentPage: 'trading', user: user });
});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`)
})