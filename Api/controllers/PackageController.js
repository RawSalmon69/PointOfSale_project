const express = require('express');
const app = express();
const Service = require('./Service');

const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');
const BillSaleModel = require('../models/BillSaleModel');
const BankModel = require('../models/BankModel');

app.get('/packages/list', async (req, res) => {
    try {
        const results = await PackageModel.findAll({
            order: [
                ['price', 'ASC'],
            ],
        });
        res.statusCode = 200;
        return res.send({ results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
});

app.post('/packages/memberRegister', async(req,res)=>{
    try{
        const result = await MemberModel.create(req.body);
        res.statusCode = 200;
        return res.send({message: 'success', result: result})
    }catch (e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})

app.get('/packages/countBill', Service.isLogin, async( req, res) => {
    try{
        const { Sequelize } = require('sequelize');
        const Op = Sequelize.Op;
        const BillSaleModel = require('../models/BillSaleModel');
        const myDate = new Date();
        const m = myDate.getMonth() + 1;
        
        const results = await BillSaleModel.findAll({
            where:{
                [Op.and]: [
                    Sequelize.fn('EXTRACT(MONTH from "updatedAt") = ', m),
                ],
                userId: Service.getMemberId(req)
            }
        });

        res.statusCode = 200;
        return res.send({message: 'success', totalBill: results.length})
    }catch (e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})
MemberModel.sync({alter: true}); //if a table is created, delete this
module.exports = app;