const express = require('express');
const app = express();
const Service = require('./Service');
const UserModel = require('../models/UserModel');

app.get('/user/list', Service.isLogin, async (req, res) => {
    try {
        const results = await UserModel.findAll({
            where:{
                userId: Service.getMemberId(req)
            },
            attributes: ['id','level','name','usr','userId'],
            order: [['id', 'DESC']]
        });
        res.statusCode = 200;
        return res.send({ message: 'success', results: results })
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.post('/user/insert', Service.isLogin, async (req, res) => {
    try {
        let payload=req.body;
        payload.userId = Service.getMemberId(req);

        await UserModel.create(req.body);
        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.delete('/user/delete/:id', Service.isLogin, async (req, res) => {
    try {
        await UserModel.destroy({
            where: {
                id: req.params.id
            }
        });

        res.statusCode = 200;
        return res.send({ message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})
app.post('/user/edit', Service.isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.userId = Service.getMemberId(req);

        await UserModel.update(payload, {
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

module.exports = app;