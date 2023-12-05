const express = require('express');
const app = express();

const PackageModel = require('../models/PackageModel');
const MemberModel = require('../models/MemberModel');

app.get('/packages/list', async (req, res) => {
    try {
        const results = await PackageModel.findAll({
            order: [
                ['price', 'ASC'],
            ],
        });
        res.send({ results: results });
    } catch (e) {
        res.send({ message: e.message });
    }
});

app.post('/packages/memberRegister', async(req,res)=>{
    try{
        const result = await MemberModel.create(req.body);
        res.send({message: 'success', result: result})
    }catch (e){
        res.send({message: e.message});
    }
})

MemberModel.sync({alter: true}); //if a table is created, delete this
module.exports = app;