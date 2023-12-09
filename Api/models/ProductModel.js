const connect = require('../connect');
const { DataTypes } = require('sequelize');

const ProductModel = connect.define('product',{
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    barcode: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cost: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    details:{
        type: DataTypes.STRING(255),
        allowNull: true
    },
})
ProductModel.sync({alter: true});

module.exports = ProductModel;