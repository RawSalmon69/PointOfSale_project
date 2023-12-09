const express = require('express');
const app = express();
const ProductModel = require('../models/ProductModel');
const Service = require('./Service');

app.post('/product/insert', Service.isLogin, async(req,res) =>{
    try{
        const result = await ProductModel.create(req.body);
        res.send({result : result, message:'success'});
    } catch(e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})
app.get('/product/list', Service.isLogin, async(req,res) => {
    try{
        const results = await ProductModel.findAll({
            order: [['id', 'DESC']]
        });
        res.statusCode = 200;
        return res.send({message: 'success',results: results});
    }catch(e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})
app.delete('/product/delete/:id', Service.isLogin, async(req,res) => {
    try{
        const result = await ProductModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.statusCode = 200;
        return res.send({message: 'success', result: result});
    }catch(e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})
app.post('/product/update', Service.isLogin, async(req,res) =>{
    try{
        const result = await ProductModel.update(req.body, {
            where: {
                id: req.body.id
            }
        });
        res.send({message:'success',result : result});
    } catch(e){
        res.statusCode = 500;
        return res.send({message: e.message});
    }
})
module.exports = app;