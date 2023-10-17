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
    const isValidId = mongoose.Types.ObjectId.isValid(productid); 
    if(isValidId){
        const product= await Product.findOne({_id:productid});
        if(product){
            res.status(200).send({ status: 200, message: "products fetched successfully", data: productid});
        }else{
            res.status(404).send({ status: 404, message: "no products found"});
        }
    }else{
        res.status(400).send({ status: 400, message: "invalid product id"});
    }
});


productsRoute.post("/:user/newproduct",Authorization(['admin','seller']), async (req, res) => {
    const {user}= req.params;
    const token = req?.headers?.authorization?.split(" ")[1];
    if(token && user){
        if(token!==user){ 
            res.status(401).send({ status: 401, message: `Invalid token` });
        }else{
            const {image, title,description,price,category,stocks,color,sizes,discount,rating,ratingCount,addedBy}= req.body;
            if(!image){
                return res.status(406).send({ status: 406, message: `image is required.` }); 
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
            const { result } = await verifyToken(token);
            if(result.user){
                const Exist = await User.findOne({ email: result?.user });
                if(Exist){
                    try {
                        const newProduct= new Product({...req.body,addedBy:Exist?._id});
                        await newProduct.save();
                        res.status(201).send({ status: 201, message: `new product added successfully` });
                    } catch (error) {
                        res.status(500).send({ status: 500, message: `something went wrong.` });
                    }
                }else{
                    res.status(404).send({ status: 404, message: `no admin/seller found` });
                }
            }else{
                res.status(500).send({ status: 500, message: `Internal jwt server error.` });
            }
        }
    }else{
        res.status(401).send({ status: 401, message: `both user and token are required` });
    }

});

productsRoute.put('/editproduct/:productid',Authorization(['admin','seller']),async(req,res)=>{
    const {productid}= req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(productid); 
    if(isValidId){
        const product= await Product.findOne({_id:productid});
        if(product){
           try {
            const updatedProduct= await Product.findByIdAndUpdate({_id:productid},{...req.body},{new:true});
            res.status(200).send({ status: 200, message: "products updated successfully",data:updatedProduct});
           } catch (error) {
            res.status(500).send({ status: 500, message: "internal server error."});
           }
        }else{
            res.status(404).send({ status: 404, message: "no products found"});
        }
    }else{
        res.status(400).send({ status: 400, message: "invalid product id"});
    }
});

productsRoute.delete("/deleteproduct/:productid",Authorization(['admin','seller']),async(req,res)=>{
    const {productid}= req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(productid); 
    if(isValidId){
        const product= await Product.findOne({_id:productid});
        if(product){
           try {
            const deleteProduct= await Product.findByIdAndDelete({_id:productid});
            res.status(200).send({ status: 200, message: "product deleted successfully"});
           } catch (error) {
            res.status(500).send({ status: 500, message: "internal server error."});
           }
        }else{
            res.status(404).send({ status: 404, message: "no products found"});
        }
    }else{
        res.status(400).send({ status: 400, message: "invalid product id"});
    }
});





module.exports = { productsRoute };
