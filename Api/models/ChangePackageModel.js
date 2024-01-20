const conn = require('../connect');
const { DataTypes } = require('sequelize');

const ChangePackageModel = conn.define('changePackage', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    packageId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },    
})

ChangePackageModel.sync({ alter: true });
module.exports = ChangePackageModel;