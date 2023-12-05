const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_workshop_pos', 'postgres', '2323', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;