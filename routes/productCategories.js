const express=require('express');

const productCategories=express.Router();
const poolPromise=require('../shared/pool');




  productCategories.get('/',async (req,res)=>{

    try{
      const pool = await poolPromise;
      const sql='select * from categories';
      const result = await pool.request().query(sql);
      const data = result.recordset;
      console.log('datadsfsdf',data)
      res.status(200).json(data)
    }catch(error){
      res.status(500).send(err);
    }

  });

    module.exports=productCategories;