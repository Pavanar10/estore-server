const bcryptjs = require('bcryptjs');
const express = require('express');
const users = express.Router();
const poolPromise=require('../shared/pool');
const jwtoken = require('jsonwebtoken');




users.get('/getUsers', async (req,res)=>{
  try{
    const pool =  await poolPromise;

    const result = await pool.request().query('select * FROM users');
    const data = result.recordset;
    console.log(data)
  res.status(200).json(data);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).send("Error retrieving data");
}
});

users.post('/addUser',async(req,res)=>{
    try{
        let firstName=req.body.firstName;
        let lastName=req.body.lastName;
        let email=req.body.email;
        let address = req.body.address;
        let city=req.body.city;
        let state=req.body.state;
        let password = req.body.password;
        let pin = req.body.pin;

        const pool = await poolPromise;
        const result = await pool.request().query(`select count(*) as count from users where email like '${email}'`);
        if(result.recordset[0].count>0){
            res.status(200).send({message:'Email already exists'});
        }else{
        bcryptjs.hash(password,10)
        .then(async (hashpassword)=>{
            const sql=`insert into users (firstName,lastname,address,email,pin,city,state,password)
            values ('${firstName}','${lastName}','${address}','${email}','${pin}','${city}','${state}','${hashpassword}')`;

            const result1 = await pool.request().query(sql);
    
            res.status(201).send({message:'success'});
    
        })

        }
    }catch(error){
        console.log("error");
        res.status(400).send({error:error.code,
            message:error.message})
    }
})

users.delete('/deleteUser/(:id)',async (req,res)=>{
    try{
        let id = req.params.id;
        const pool = await poolPromise;

        const result = await pool.request().query('delete from users where id= '+id);
        res.status(200).send({message:'successfully deleted'});
    }
    catch(error){
        res.status(500).send({
            error:error.code,
            message:error.message
        })
    }
})
users.put('/updateUser',async (req,res)=>{
    const { id,firstName, lastName, email,address,city,password,state,pin } = req.body;
    console.log(id,firstName,lastName,email,address,password,pin,state,city);
    try{
        const pool = await poolPromise;
        bcryptjs.hash(password,0)
        .then((hashpassword)=>{
            const sql = `update users set firstName= '${firstName}',lastName='${lastName}',email='${email}',
            address='${address}',city='${city}',state='${state}',pin='${pin}',password='${hashpassword}' where id =${id}`
            const r = pool.request().query(sql);
            res.status(200).send({message:'successfully updated'});
        })
    
    
    }
    catch(error){
        res.status(500).send({
            error:error.code,
            message:error.message
        })
    }
})
// GET endpoint to retrieve data

/*users.post('/signup', async (req, res) => {
    try {
        let firstName=req.body.firstName;
        let lastName = req.body.lastName;
        let address = req.body.address;
        let city = req.body.city;
        let pin = req.body.pin;
        let state = req.body.state;
        let email = req.body.email;
        let password =req.body.password;

        const pool = await poolPromise;
        // Execute each query in the array
        
        const result = await pool.request().query(`select count(*) as count from users where email like '${email}'`);
        console.log(result.recordset[0].count)
        if(result.recordset[0].count>0){
            res.status(200).send('Email Already exists')
        }else{
            console.log("gere")
            bcryptjs.hash(password,10)
            .then(async (hashedPasswrd)=>{
                const sql = `Insert into users
                (email,firstName,lastName,address,pin,state,password,city) values
                ('${email}','${firstName}','${lastName}','${address}','${pin}','${state}','${hashedPasswrd}','${city}')`;
                console.log(sql);
                const datainserted = await pool.request().query(sql);
                res.status(200).send("Success");
            });
        }
    } catch (err) {
        console.error("Error executing queries:", err);
        res.status(500).send("Error executing queries");
    }
})*/




/*users.post('/signup',(req,res)=>{
try{
        let firstName=req.body.firstName;
        let lastName = req.body.lastName;
        let address = req.body.address;
        let city = req.body.city;
        let pin = req.body.pin;
        let state = req.body.state;
        let email = req.body.email;
        let password =req.body.password;
        pool.connect()
        .then(()=>{
            return pool.query(`select count(*) as count from users where email like '${email}'`);
        }).then(resultCount=>{
            console.log(resultCount.recordset[0].count)
            if(resultCount.recordset[0].count>0){
                res.status(200).send('Email Already exists')
            }else{
                bcryptjs.hash(password,10).then((hashedPasswrd)=>{
                    const query = `Insert into users
                    (email,firstName,lastName,address,pin,state,password,city) values
                    ('${email}','${firstName}','${lastName}','${address}','${pin}','${state}','${hashedPasswrd}','${city}')`;
                    console.log(query)
                    pool.connect()
                    .then(()=>{
                        return pool.query(query)
                    }).then(result1=>{
                        res.status(201).send('Success')
                    }).catch(error=>{
                        res.status(401).send(error)
                    })
                   
                })
            }
        })
        .catch(err => {
            // Handle errors
            res.status(500).send(err);
          })
          .finally(() => {
            // Close the connection pool
            pool.close();
          });
        }catch(error){
            res.status(500).send(error)
        }
})*/
users.post('/login',async(req,res)=>{
    try{
        let email = req.body.email;
        console.log(email)
        let password = req.body.password;
        const pool = await poolPromise;
        const result = await pool.request().query(`select * from users where email like '${email}'`);
        if(result.recordset[0]){
       console.log(result.recordset[0])
            bcryptjs.compare(password,result.recordset[0].password)
            .then(compareResult=>{
                if(compareResult){
                    const token = jwtoken.sign(
                        {
                            id:result.recordset[0].id,
                            email:result.recordset[0].email
                        },
                        'estore-secret-key',
                        {expiresIn:'1h'}
                    );
                    res.status(200).send({token:token,
                   expiresInSeconds:3600 ,
                user:{
                    firstName:result.recordset[0].firstName,
                    lastName:result.recordset[0].lastName,
                    address:result.recordset[0].address,
                    city:result.recordset[0].city,
                    state:result.recordset[0].state,
                    pin:result.recordset[0].pin,
                }});
                }
                else {
                    res.status(401).send({message:'Invalid Password'});
                }
            })
    }else{
        res.status(401).send({messgae:'User Does Not Exist'});
    }
    }
    catch(error){
        res.status(400).send({error:error.code,message:error.message});
    }
})




module.exports=users;