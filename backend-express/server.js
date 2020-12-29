const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const setLocaleCookie = require('./setLocaleCookie');
const setCurrencyCookie = require('./setCurrencyCookie');
const bodyParser = require('body-parser');

const session = require('express-session');

const sess = {
  saveUninitialized: false,
  resave: false,
  secret: 'very secret 12345',
  cookie: {
    secure: false,
  },
};

app.use(session(sess));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(setLocaleCookie);
app.use((req, res, next) => {
  console.log(req.path);
  next();
});
app.get('/cookies', (req, res) => {
  res.send(req.cookies.locale);
});
app.get('/hint_currency', (req, res) => {
  res.send(req.cookies.locale || req.locale);
});
app.get('/shops/:id', (req, res) => {
  const { id } = req.params;
  if (!(id > 0 && id < 4)) return res.sendStatus(404);

  const shops = [
    { owner: 'Miley', price: '40.00', currency: 'USD', id: '1' },
    { owner: 'Drake', price: '80.00', currency: 'CAD', id: '2' },
    { owner: 'Elizabeth', price: '7000.00', currency: 'GBP', id: '3' },
  ];

  return res.send(shops.find((shop) => shop.id === id));
});
app.get('/users/current', (req, res) => {
  if (req.session.user) return res.send(req.session.user);
  else return res.sendStatus(204);
});

app.post('/login', (req, res, next) => {
  if (req.body.username === 'Miley') {
    req.session.user = { username: 'Miley', currency: 'USD' };
  }
  if (req.body.username === 'Drake') {
    req.session.user = { username: 'Drake', currency: 'CAD' };
  }
  if (req.body.username === 'Elizabeth') {
    req.session.user = { username: 'Elizabeth', currency: 'GBP' };
  }
  console.log(`logged in ${req.session.user.username}`);
  res.sendStatus(200);
});

app.delete('/logout', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  console.log(`logging out ${req.session.user.username}`);
  delete req.session.user;
  if (!req.session.user) console.log(`success`);
  return res.sendStatus(200);
});

app.listen(4000, () => {
  console.log('start');
});
