const conn = require('../connect');
const { DataTypes } = require('sequelize');
const StockModel = conn.define('stock', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    qty: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT
    }
})

StockModel.sync({alter: true});

module.exports = StockModel;