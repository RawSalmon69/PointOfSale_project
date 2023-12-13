const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Service = require('./Service');

const BillSaleModel = require('../models/BilSaleModel');
const BillSaleDetailModel = require('../models/BilSaleDetailModel')

app.get('/billSale/openBill', Service.isLogin, async (req, res) => {
    try {
        const payload = {
            userId: Service.getMemberId(req),
            status: "open"
        }

        let result = await BillSaleModel.findOne({
            where: payload

        });
        if (result === null) {
            result = await BillSaleModel.create(payload);
        }

        res.statusCode = 200;
        return res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.post('/billSale/sale', Service.isLogin, async (req, res) => {
    try {
        const payload = {
            userId: Service.getMemberId(req),
            status: "open"
        }
        const currentBill = await BillSaleModel.findOne({
            where: payload
        }
        );
        const item = {
            price: req.body.price,
            productId: req.body.id,
            billSaleId: currentBill.id,
            userId: payload.userId
        }
        const billSaleDetail = await BillSaleDetailModel.findOne({
            where: item
        }
        );

        if (billSaleDetail == null) {
            item.qty = 1;
            await BillSaleDetailModel.create(item);
        } else {
            item.qty = parseInt(billSaleDetail.qty) + 1;
            await BillSaleDetailModel.update(item, {
                where: {
                    id: billSaleDetail.id
                }
            });
        }


        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

module.exports = app;