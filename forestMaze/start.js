const { readFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const app = express();
const port = 8000;
const mainPage = join(__dirname, 'index.html');
const loginPage = join(__dirname, 'login.html');

const users = new Set();

app.use('/lib', express.static(join(__dirname, 'lib')));
app.use('/style.css', express.static(join(__dirname, 'style.css')));

function mainPageView(req, res) {
  if (!req.params.name) {
    res.sendFile(loginPage);
    return;
  }
  res.sendFile(mainPage);
}
app.get('/', mainPageView);
app.get('/index.html', mainPageView);

app.get('/users', (req, res) => {
  res.send(Array.from(users.values()).join(', '))
});

app.get('/post', (req, res) => {
  req.
  res.send(Array.from(users.values()).join(', '))
});

app.listen(port, () => {
  console.log(`Forest maze app listening on port ${port}`)
});
