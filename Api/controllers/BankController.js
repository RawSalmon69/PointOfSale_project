const express = require('express');
const app = express();
const Service = require('./Service');
const BankModel = require('../models/BankModel');

app.get('/bank/list', async (req, res) => {
    try {
        const results = await BankModelModel.findAll({
            order: [
                ['id', 'ASC'],
            ],
        });
        res.statusCode = 200;
        return res.send({ results: results });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

module.exports = app;
