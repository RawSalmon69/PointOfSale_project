const conn = require('../connect');
const { DataTypes } = require('sequelize');

const BankModel = conn.define('bank', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    bankType: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bankCode: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bankName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bankBranch: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    
})

BankModel.sync({ alter: true });
module.exports = BankModel;