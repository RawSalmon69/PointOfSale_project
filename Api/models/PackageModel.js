const connect = require('../connect');
const { DataTypes } = require('sequelize');

const PackageModel = connect.define('package',{
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bill_amount:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
})

module.exports = PackageModel;