const express = require('express');
const poolPromise = require('../shared/pool');
const orders=express.Router();
const checkToken=require('../shared/checktoken');


orders.post('/add',checkToken,async(req,res)=>{
    try{
        let userName=req.body.userName;
        let userEmail=req.body.userEmail;
        let address = req.body.address;
        let city = req.body.city;
        let state=req.body.state;
        let pin = req.body.pin;
        let total = req.body.total;
        let orderDetails=req.body.orderDetails;
     
        const sql = `select id from users where email='${userEmail}'`;
        const pool = await poolPromise;
        const result = await pool.request().query(sql);
        console.log("email",result.recordset[0]);
        if(result.recordset[0]){
            let userID = result.recordset[0].id;
            const query = `insert into orders (userId,userName,address,city,state,pin,total)
            values(${userID},'${userName}','${address}','${city}','${state}','${pin}','${total}');
            SELECT SCOPE_IDENTITY() as orderId`;

            const result1= await pool.request().query(query);
            console.log('orderid1',result1.recordset[0].orderId);

            if(result1.recordset[0].orderId){
                let orderId=result1.recordset[0].orderId;
                console.log("orderID",orderId)
                orderDetails.forEach(async element => {
                    console.log(orderDetails)
                    const detailsQuery=`Insert into orderdetails (fk_orderId,fk_productId,qty,price,amount)
                    values(${orderId},${element.productId},${element.qty},${element.price},${element.amount})`;
                    console.log("detailsQuery",detailsQuery);
                  
                      const res1 =  await pool.request().query(detailsQuery);

                    res.status(200).send({message:'Success'});
                });

            }else{
                res.status(401).send({
                    error:error.code,
                    message:error.message,
                })
            }

        }else{
            res.status(401).send({message:`User Doesn't exist`});
        }
    }catch(error){
        res.status(400).send({error:error.code,message:error.message});
    }
})
module.exports=orders;