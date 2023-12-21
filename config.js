// config.js

module.exports = {
    development: {
      DB_USER: 'root',
      PASSWORD: 'Ravi@786',
      DB_NAME: 'rtpl_database',
      host: 'localhost',
      dialect: 'mysql',
      PORT: 5000,
      jwt:{
        secret:'rtplsecret'
      },
      NODEMAILER:{
        SERVICE:'Gmail',
        PROVIDER_EMAIL:'dummy703666@gmail.com',
        PROVIDER_PASSWAORD:'Ravi@786'
      },
      APIURL: 'http://localhost:5000/api/'
    },
    production:{
      DB_USER: 'root',
      PASSWORD: 'Ravi@786',
      DB_NAME: 'rtpl_database',
      host: 'localhost',
      dialect: 'mysql',
      PORT: 8080,
      APIURL: 'http://localhost:5000/api/',
      
    }
  };
  