const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Service = require('./Service');

const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel')

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

app.get('/billSale/currentBillInfo', Service.isLogin, async (req, res) => {
    try {

        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const results = await BillSaleModel.findOne({
            where: {
                userId: Service.getMemberId(req),
                status: "open"
            },
            include: {
                model: BillSaleDetailModel,
                order: [['id', 'DESC']],
                include: {
                    model: ProductModel,
                    attributes: ['name'],
                }
            }
        })

        res.statusCode = 200;
        return res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.delete('/billSale/deleteItem/:id', Service.isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.post('/billSale/updateQty', Service.isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.update({
            qty: req.body.qty
        },
            {
                where: {
                    id: req.body.id
                }
            })
        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.get('/billSale/endSale', Service.isLogin, async (req, res) => {
    try {
        await BillSaleModel.update({
            status: 'closed'
        },
            {
                where: {
                    status: 'open',
                    userId: Service.getMemberId(req)
                }
            })
        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.get('/billSale/lastBill', Service.isLogin, async (req, res) => {
    try {
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const result = await BillSaleModel.findAll({
            where: {
                status: 'closed',
                userId: Service.getMemberId(req)
            },
            order: [['id', 'DESC']],
            limit: 1,
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProductModel,
                    attributes: ['barcode', 'name']
                }
            }
        })

        res.statusCode = 200;
        return res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.get('/billSale/billToday', Service.isLogin, async (req, res) => {
    try {
        const BillSaleDetailModel = require('../models/BillSaleDetailModel');
        const ProductModel = require('../models/ProductModel');

        BillSaleModel.hasMany(BillSaleDetailModel);
        BillSaleDetailModel.belongsTo(ProductModel);

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const now = new Date();
        const { Sequelize } = require('sequelize');
        const Op = Sequelize.Op;

        const results = await BillSaleModel.findAll({
            where: {
                status: 'closed',
                userId: Service.getMemberId(req),
                updatedAt: {
                    [Op.between]: [
                        startDate.toISOString(),
                        now.toISOString()
                    ]
                }
            },
            order: [['id', 'DESC']],
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProductModel,
                    attributes: ['barcode', 'name']
                }
            }
        })

        res.statusCode = 200;
        return res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

module.exports = app;