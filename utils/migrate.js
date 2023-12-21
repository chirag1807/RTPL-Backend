const sequelize = require("./database.config");
const Employee = require('../models/employee');
    
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('-----------------------------');
    console.log('Table created successfully');
    console.log('-----------------------------');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    sequelize.close();
  }
})();