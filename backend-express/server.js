const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const setLocaleCookie = require('./setLocaleCookie');

app.use(cookieParser());
app.use(setLocaleCookie);
app.get('/cookies', (req, res, next) => {
  res.send(req.cookies.locale);
});

app.listen(4000, () => {
  console.log('start');
});
