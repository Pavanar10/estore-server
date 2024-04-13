const express = require('express');
const products = express.Router();
const poolPromise=require('../shared/pool');



products.get('/',async (req,res)=>{
    var mainCategoryId=req.query.maincategoryid;
    var subCategoryId=req.query.subcategoryid;
    var keyword=req.query.keyword;

    let sqlquery = 'select * from products';
    if(subCategoryId){
        sqlquery+=' where fk_category_id=' +subCategoryId;
       
    }
    if(mainCategoryId){
        sqlquery=`select products.* from products,categories 
        where products.fk_category_id =categories.id and categories.parent_category_id=${mainCategoryId}`;
    }
    if(keyword){
      sqlquery += `  and keywords like '%${keyword}%'`
    }
    try {
      const pool = await poolPromise;
      // Make a query to retrieve data
      const result = await pool.request().query(sqlquery);
       
      // Process the retrieved data
      const data = result.recordset;

  

      res.status(200).json(data);
  } catch (err) {
      console.error("Error retrieving data:", err);
      res.status(500).send("Error retrieving data");
  }


    /*pool.connect()
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
    });*/
});

products.get('/(:id)', async (req,res)=>{
    let id = req.params.id;
  try{
    const pool =  await poolPromise;
    const result = await pool.request().query('SELECT * FROM products where id='+id);
    const data = result.recordset;

  res.status(200).json(data);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).send({message:"Error retrieving data"});
}
    /*pool.connect()
    .then(()=>{
        return pool.query('SELECT * FROM products where id='+id);
    }).then(result=>{
        res.status(200).send(result.recordset);
    }).catch(err=>{
        res.status(500).send(err);
    }).finally(()=>{
        pool.close();
    })*/
})
module.exports=products;