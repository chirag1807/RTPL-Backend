const express = require('express');
const app = express();
const chalk = require('ansi-colors');
require('dotenv').config();
const models = require('./models/models');
const bodyParser = require('body-parser');
const cors = require("cors");
var multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use("/uploads", express.static("uploads"));
// var upload = multer();
// app.use(upload.any());


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
  res.send('Hello, Warm Regards from RTPL Group!')
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
