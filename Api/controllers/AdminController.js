const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AdminModel = require('../models/AdminModel');

app.post('/admin/signin', async (req, res) => {
    try {
        const admin = await AdminModel.findOne({
            where: {
                usr: req.body.usr,
                pwd: req.body.pwd
            }
        })
        if (admin != null) {
            let token = jwt.sign({ id: admin.id }, process.env.secret);
            res.statusCode = 200;
            return res.send({ token: token, message: 'success' });
        } else {
            res.statusCode = 401;
            return res.send({ message: 'Admin usr incorrect' });
        }
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

module.exports = app;