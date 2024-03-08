const express=require('express');
const sql =require('mssql');
const cors=require('cors');
const productCategories = require('./routes/productCategories');
const products=require('./routes/products');
const app=express();

app.use(cors());

const PORT=5001;


app.use('/productCategories',productCategories);
app.use('/products',products);
    //res.status(200).send(products)
const server=app.listen(PORT,()=>{
    console.log("App is running on the server");
})