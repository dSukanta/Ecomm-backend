const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
require('dotenv').config();


const hashPassword = (password)=>{
    const hash = bcrypt.hashSync(password, 10);
    if(hash){
        return {encrypt:hash, error: false};
    }else{
        return {encrypt:null, error:true}
    }
};

const comparePassword = (password,dbPass)=>{
    const result= bcrypt.compareSync(password,dbPass);
    if(result){
        return {decrypt:result, error: false};
    }else{
        return {decrypt:null, error:true}
    }
};


const createToken= (email)=>{
    const privateKey= process.env.PRIVATE_JWT_KEY
    const token= jwt.sign({user: email}, privateKey,{expiresIn:'1h'});
    if(token){
        return {token:token, error:false};
    }else{
        return {token:null, error:true};
    }
};

const verifyToken= (token)=>{
    const privateKey= process.env.PRIVATE_JWT_KEY
    const result= jwt.verify(token,privateKey);
    if(result){
        return {result, error:false};
    }else{
        return {result:null, error:true};
    }
}



module.exports={hashPassword , comparePassword , createToken,verifyToken}