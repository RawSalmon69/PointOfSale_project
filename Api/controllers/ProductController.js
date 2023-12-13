const express = require('express');
const app = express();
const ProductModel = require('../models/ProductModel');
const Service = require('./Service');

app.post('/product/insert', Service.isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.userId = Service.getMemberId(req);
        const result = await ProductModel.create(payload);
        res.send({ result: result, message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.get('/product/list', Service.isLogin, async (req, res) => {
    try {
        const results = await ProductModel.findAll({
            where: {
                userId: Service.getMemberId(req)
            },
            order: [['barcode', 'ASC']]
        });
        res.statusCode = 200;
        return res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.delete('/product/delete/:id', Service.isLogin, async (req, res) => {
    try {
        const result = await ProductModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.statusCode = 200;
        return res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.post('/product/update', Service.isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.userId = Service.getMemberId(req);
        const result = await ProductModel.update(payload, {
            where: {
                id: req.body.id
            }
        });
        res.send({ message: 'success', result: result });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.get('/product/listForSale', Service.isLogin, async (req, res) => {
    const ProductImageModel = require('../models/ProductImageModel');

    ProductModel.hasMany(ProductImageModel);

    try {
        const results = await ProductModel.findAll({
            where: {
                userId: Service.getMemberId(req)
            },
            order: [['barcode', 'ASC']],
            include: {
                model: ProductImageModel,
                where: {
                    isMain: true
                }
            }
        });
        res.statusCode = 200;
        return res.send({ message: 'success', results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

module.exports = app;