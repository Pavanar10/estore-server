const jwt = require('jsonwebtoken');


module.exports=(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        jwt.verify(token,'estore-secret-key');
        next();

    }catch(error){
        res.status(401).send({message:'Authorization Failed'});
    }
}