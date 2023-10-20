const express= require('express');
const { Authorization } = require('../middlewares/Authorization');
const { User } = require('../models/userModel');
const { comparePassword, createToken, checkValidId,verifyToken} = require('../utils/helper');
const mongoose  = require('mongoose');
const { Cart } = require('../models/CartModel');
const { Category } = require('../models/CategoryModel');


const categoryRoute= express.Router();
 
categoryRoute.get('/allcategories',async(req,res)=>{
   try {
    const categoris= await Category.find();
    res.status(200).send({status:200,message:'Categories fetched successfully',data:categoris});
   } catch (error) {
    res.status(500).send({status:500,message:'Something went wrong.Try again later.'});
   }
});

categoryRoute.post('/addcategory',Authorization(['admin','seller']),async(req,res)=>{
    const token = req?.headers?.authorization?.split(" ")[1];
    const {title}= req.body;
    
    if(!title){
        return res.status(400).send({ status: 400, message: `category title is required`});
    };
    
    if(token){
        const { result } = await verifyToken(token);
        if(result?.user){
            const Exist = await User.findOne({ email: result?.user });
            if(Exist){
                try {
                    const existCategory= await Category.findOne({title});
                    if(existCategory){
                        res.status(409).send({ status: 409, message: `Category already exists` });
                    }else{
                        const newCategory= new Category({title,addedby:Exist?._id});
                        await newCategory.save();
                        res.status(200).send({ status: 200, message: `Category added successfully`});
                    }
                } catch (error) {
                    res.status(500).send({ status: 500, message: `something went wrong.` });
                }
            }else{
                res.status(404).send({ status: 404, message: `no user found.` });
            }
        }else{
            res.status(500).send({ status: 500, message: `Internal jwt server error.` });
        }
    }else{
        res.status(401).send({ status: 401, message: `token missing or invalid` });
    }
});

categoryRoute.delete('/deletecategory/:categoryid',async(req,res)=>{
    const {categoryid} = req.params;
    const isVaid= checkValidId(categoryid);
    if(!isVaid){
        return res.status(400).send({ status: 400, message: `category id is invalid` });
    }
    if(!categoryid){
        res.status(400).send({ status: 400, message: `category is missing ` });
    }else{
        const token = req?.headers?.authorization?.split(" ")[1];
        if(!token){
            res.status(401).send({ status: 401, message: `token is missing.` });
        }else{
            const { result } = await verifyToken(token);
            if(result?.user){
                const Exist = await User.findOne({ email: result?.user });
                if(Exist){
                    try {
                        const deleteCategory= await Category.findByIdAndDelete({_id:categoryid,addedby: Exist?._id});
                        res.status(200).send({ status: 200, message: `category deleted successfully`});
                    } catch (error) {
                        res.status(404).send({ status: 404, message: `category not found` });
                    }
                }else{
                    res.status(404).send({ status: 404, message: `no user found.` });
                }
            }else{
                res.status(500).send({ status: 500, message: `Internal jwt server error.` });
            }
        }
    }
})





module.exports = {categoryRoute}
