const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { hashPassword, comparePassword, createToken, verifyToken } = require('../utils/helper');
const { Address } = require("../models/AddressModel");
const { Product } = require("../models/productSchema");
const { Authorization } = require("../middlewares/Authorization");

const productsRoute = express.Router();

productsRoute.get("/", async(req, res) => {
    const products= await Product.find();
    res.status(200).send({ status: 200, message: "products fetched successfully", data: products});
});

productsRoute.get("/:productid",async(req,res)=>{
    const {productid}= req.params;
    const products= await Product.find({_id:productid});
    res.status(200).send({ status: 200, message: "products fetched successfully", data: products});
});

productsRoute.post("/:user/addnew",Authorization('admin'), async (req, res) => {
    const {user}= req.params;
    const token = req?.headers?.authorization?.split(" ")[1];
    if(token && user){
        if(token!==user){
            res.status(401).send({ status: 401, message: `Invalid token` });
        }else{
            const {image, title,description,price,category,stocks,color,sizes,discount,rating,ratingCount,addedBy}= req.body;
            if(!image || !Array.isArray(image)){
                return res.status(406).send({ status: 406, message: `image should be inside an array` }); 
            };
            if(!title){
                return res.status(400).send({ status: 400, message: `title is required` }); 
            };
            if(!description){
                return res.status(400).send({ status: 400, message: `description is required` }); 
            };
            if(!price){
                return res.status(400).send({ status: 400, message: `price is required` }); 
            };
            if(!category){
                return res.status(400).send({ status: 400, message: `category is required` }); 
            };
            if(!stocks){
                return res.status(400).send({ status: 400, message: `stocks is required` }); 
            };
            if(!color){
                return res.status(400).send({ status: 400, message: `color is required` }); 
            };
            if(!sizes){
                return res.status(400).send({ status: 400, message: `sizes is required` }); 
            };
            if(!title){
                return res.status(400).send({ status: 400, message: `title is required` }); 
            };

            const newProduct= new Product({...req.body});
            if(newProduct){
                await newProduct.save();
                res.status(201).send({ status: 201, message: `new product added successfully` });
            }else{
                res.status(500).send({ status: 500, message: `something went wrong.` });
            }
        }
    }else{
        res.status(401).send({ status: 401, message: `both user and token are required` });
    }

});



module.exports = { productsRoute };
