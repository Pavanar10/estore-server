const express=require('express');
const sql =require('mssql');
const cors=require('cors');
const productCategories = require('./routes/productCategories');
const products=require('./routes/products');
const orders = require('./routes/order');

const users=require('./routes/users');
const app=express();
const bodyParser = require('body-parser');
const PORT=5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/productCategories',productCategories);
app.use('/products',products);
app.use('/users',users);
app.use('/orders',orders)
    //res.status(200).send(products)
const server=app.listen(PORT,()=>{
    console.log("App is running on the server");
})