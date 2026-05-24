const jwt = require("jsonwebtoken");

function auth(req,res,next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send("Unauthorized");
    }

    jwt.verify(token,"secretkey",(err,user)=>{

        if(err){
            return res.status(403).send("Invalid Token");
        }

        req.user = user;

        next();
    });
}

module.exports = auth;
