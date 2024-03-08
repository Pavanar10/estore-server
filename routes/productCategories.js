const express=require('express');

const productCategories=express.Router();
const pool = require('../shared/pool')




  productCategories.get('/',(req,res)=>{
    pool.connect()
  .then(() => {
    // Query database and get the result set
    return pool.query('SELECT * FROM categories');
  })
  .then(result => {
    // Process the result set
   
    res.send(result.recordset);
  })
  .catch(err => {
    // Handle errors
    console.log(err)
    res.status(500).send(err);
  })
  .finally(() => {
    // Close the connection pool
    pool.close();
  });

         /*  sql.connect(config, function (err) {
    
            if (err) {
                res.status(500).send(err);
            } */
            // create Request object
  /*           var request = new sql.Request();
               
            // query to the database and get the records
            pool.query('select * from categories', function (error, recordset) {
                
                if (error) {
                    res.status(500).send(error);
                }else{
                // send records as a response
                res.send(recordset.recordset);
            }               
            });
        }); */
    })

    module.exports=productCategories;