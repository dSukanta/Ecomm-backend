const express= require('express');
const { Authorization } = require('../middlewares/Authorization');
const { User } = require('../models/userModel');
const { comparePassword, createToken, checkValidId,verifyToken} = require('../utils/helper');
const mongoose  = require('mongoose');
const { Cart } = require('../models/CartModel');


const cartRoute= express.Router();
 
cartRoute.get('/mycart/:user',async(req,res)=>{
    const {user}= req.params;
    const token = req?.headers?.authorization?.split(" ")[1];
    if(user && token && (user === token)){
        const { result } = await verifyToken(token);
        if(result?.user){
            const Exist = await User.findOne({ email: result?.user });
            if(Exist){
                try {
                    const cartItems= await Cart.find({user: Exist?._id}).populate('product');
                    res.status(200).send({ status: 200, message: `cart item fetched successfully`,data: cartItems});
                } catch (error) {
                    console.log(error)
                    res.status(500).send({ status: 500, message: `something went wrong.` });
                }
            }else{
                res.status(404).send({ status: 404, message: `no user found.` });
            }
        }else{
            res.status(500).send({ status: 500, message: `Internal jwt server error.` });
        }
    }else{
        res.status(401).send({ status: 401, message: `Invalid token`});
    }
});

cartRoute.post('/mycart/addtocart/:user',async(req,res)=>{
    const {user}= req.params;
    const token = req?.headers?.authorization?.split(" ")[1];
    const {quantity,productid}= req.body;
    const isValidId= await checkValidId(productid);

    if(!isValidId){
        return res.status(400).send({ status: 400, message: `product id is invalid`});
    };
    if(!quantity){
        return res.status(400).send({ status: 400, message: `qunatity is required`});
    };
    
    if(user && token && (user === token)){
        const { result } = await verifyToken(token);
        if(result?.user){
            const Exist = await User.findOne({ email: result?.user });
            if(Exist){
                try {
                    const newCartItem= new Cart({product:productid,user:Exist?.id,quantity:quantity});
                    await newCartItem.save();
                    res.status(200).send({ status: 200, message: `item added to cart successfully`});
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
        res.status(401).send({ status: 401, message: `Invalid token` });
    }
});

cartRoute.put('/mycart/edit/:user/:productid',async(req,res)=>{
    const {user,productid}= req.params;
    const token = req?.headers?.authorization?.split(" ")[1];
    const isValidId= await checkValidId(productid);
    const {quantity}= req.body;
    if(!isValidId){
        return res.status(400).send({ status: 400, message: `invalid product id` });
    };
    if(!quantity){
        return res.status(400).send({ status: 400, message: `quantity is required to update` });
    };

    if(user && token && (user === token)){
        const { result } = await verifyToken(token);
        if(result?.user){
            const Exist = await User.findOne({ email: result?.user });
            if(Exist){
                try {
                    const cartItem= await Cart.find({_id:productid,user: Exist?._id});
                    if(cartItem){
                        const updated= await Cart.findByIdAndUpdate({_id:productid,user: Exist?._id},{...cartItem,quantity: quantity})
                        res.status(200).send({ status: 200, message: `cart item updated successfully`});
                    }else{
                        res.status(404).send({ status: 404, message: `cart item not found` });
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
        res.status(401).send({ status: 401, message: `Invalid token` });
    }
});

cartRoute.delete('/mycart/deleteitem/:user/:productid',async(req,res)=>{
    const {user,productid} = req.params;
    if(!user || !productid){
        res.status(400).send({ status: 400, message: `either token or product id is missing ` });
    }else{
        const token = req?.headers?.authorization?.split(" ")[1];
        if(token!==user){
            res.status(401).send({ status: 401, message: `token mismatched.` });
        }else{
            const { result } = await verifyToken(token);
            if(result?.user){
                const Exist = await User.findOne({ email: result?.user });
                if(Exist){
                    try {
                        const cartItem= await Cart.find({_id:productid,user: Exist?._id});
                        if(cartItem.length > 0){
                            const deleted= await Cart.findByIdAndDelete({_id:productid,user: Exist?._id});
                            res.status(200).send({ status: 200, message: `cart item deleted successfully`});
                        }else{
                            res.status(404).send({ status: 404, message: `cart item not found` });
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
        }
    }
})





module.exports = {cartRoute}
