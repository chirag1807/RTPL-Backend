const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const chalk = require('ansi-colors');
require('dotenv').config();
// const config = require('./config');
const models = require('./models/models');

app.use(express.json())
app.locals.models = models;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.use('/api',require('./Routes/routeIndex'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(chalk.green('RTPL'));
    console.log(chalk.green(`Environment Running in :${process.env.PORT}`));
    console.log(chalk.green(`Port: ${process.env.PORT}`));
    console.log(chalk.green(`API Link: http://localhost:${process.env.PORT}/api`));
    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(`Server is running on port ${port}`);
});
