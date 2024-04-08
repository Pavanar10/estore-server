const express =  require('express');
const products = express.Router();
const poolPromise = require('../shared/pool');




products.get('/',async (req,res)=>{
    try{
    const pool = await poolPromise;

    const result = await pool.request().query('select * from products');
    const data = result.recordset;
    res.status(200).json(data);
    }
    catch(error){
        res.send(500).send({
            error:error.code,
            message:error.message
        })
    }

})
//module.exports=products;