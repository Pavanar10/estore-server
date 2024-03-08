const express = require('express');
const products = express.Router();
const pool=require('../shared/pool');

products.get('/',(req,res)=>{
    var mainCategoryId=req.query.maincategoryid;
    var subCategoryId=req.query.subcategoryid;

    let sqlquery = 'select * from products';
    if(subCategoryId){
        sqlquery+=' where fk_category_id=' +subCategoryId;
       
    }
    if(mainCategoryId){
        sqlquery=`select products.* from products,categories 
        where products.fk_category_id =categories.id and categories.parent_category_id=${mainCategoryId}`;
    }
    pool.connect()
    .then(() => {
      // Query database and get the result set
      return pool.query(sqlquery);
    })
    .then(result => {
      // Process the result set
      res.send(result.recordset);
    })
    .catch(err => {
      // Handle errors
      res.status(500).send(err);
    })
    .finally(() => {
      // Close the connection pool
      pool.close();
    });
});

products.get('/(:id)',(req,res)=>{
    let id = req.params.id;
    pool.connect()
    .then(()=>{
        return pool.query('SELECT * FROM products where id='+id);
    }).then(result=>{
        res.status(200).send(result.recordset);
    }).catch(err=>{
        res.status(500).send(err);
    }).finally(()=>{
        pool.close();
    })
})
module.exports=products;