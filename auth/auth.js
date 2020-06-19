var jwt = require('jsonwebtoken');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());



const authenticateJWT = (req, res, next) => {
  
  const { headers: { authorization } } = req;

  let accessTokenSecret = 'secret';

  //var token = req.cookies.myCookie;

   //console.log(token);

  if(authorization){

    const token = authorization.split(' ')[1];
    
    jwt.verify(token, accessTokenSecret, (err, user) => {

       if (err) {
                return res.sendStatus(403);
            }
            req.user = user;

            next();
    })
  }
  else {
    next();
  }
}; 

module.exports = authenticateJWT;