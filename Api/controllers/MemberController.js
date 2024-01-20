const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Service = require('./Service');
const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');

app.post('/member/signin', async (req, res) => {
    try {
        const member = await MemberModel.findAll({
            where: {
                phone: req.body.phone,
                pass: req.body.pass
            }
        })
        if (member.length > 0) {
            let token = jwt.sign({ id: member[0].id }, process.env.secret);
            res.statusCode = 200;
            return res.send({ token: token, message: 'success' });
        } else {
            res.statusCode = 401;
            return res.send({ message: 'phone or password incorrect' });
        }
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

app.get('/member/info', Service.isLogin, async (req, res) => {
    try {
        MemberModel.belongsTo(PackageModel);

        const token = Service.getToken(req);
        const payload = jwt.decode(token);
        const member = await MemberModel.findByPk(payload.id, {
            attributes: ['id', 'name'],
            include: [
                {
                    model: PackageModel,
                    attributes: ['name', 'bill_amount']
                }
            ]
        })
        res.statusCode = 200;
        return res.send({ result: member, message: 'success' });
    } catch (e) {
        res.statusCode = 500;
        return res.send({ message: e.message });
    }
})

MemberModel.sync({ alter: true }); //if a table is created, delete this
module.exports = app;