const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const hashPassword = (password) => {
  if (!password) {
    return { encrypt: null, error: true };
  } else {
    const hash = bcrypt.hashSync(password, 10);
    if (hash) {
      return { encrypt: hash, error: false };
    } else {
      return { encrypt: null, error: true };
    }
  }
};

const comparePassword = (password, dbPass) => {
  if (!password || !dbPass) {
    return { decrypt: null, error: true };
  } else {
    const result = bcrypt.compareSync(password, dbPass);
    if (result) {
      return { decrypt: result, error: false };
    } else {
      return { decrypt: null, error: true };
    }
  }
};

const createToken = (email) => {
  const privateKey = process.env.PRIVATE_JWT_KEY;
  const token = jwt.sign({ user: email }, privateKey);
  if (token) {
    return { token: token, error: false };
  } else {
    return { token: null, error: true };
  }
};

const verifyToken = (token) => {
  if (!token) {
    return { result: null, error: true };
  } else {
    try {
      const privateKey = process.env.PRIVATE_JWT_KEY;
      const result = jwt.verify(token, privateKey);
      if (result) {
        return { result, error: false };
      } else {
        return { result: null, error: true };
      }
    } catch (error) {
      return { result: null, error: true };
    }
  }
};

const checkValidId= (id)=>{
  const isValidId = mongoose.Types.ObjectId.isValid(id); 
  if(isValidId){
    return true;
  }else{
    return false;
  }
}

module.exports = { hashPassword, comparePassword, createToken, verifyToken,checkValidId };
