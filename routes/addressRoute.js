const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
  checkValidId,
} = require("../utils/helper");
const { Address } = require("../models/AddressModel");

const addressRoute = express.Router();

addressRoute.get("/", (req, res) => {
  res.status(200).send({ status: 200, message: "this is an address route" });
});

addressRoute.get("/myaddress/:user/", async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const token2 = req?.params?.user;
  if (token && token2) {
    if (token !== token2) {
      res.status(401).send({ status: 401, message: `Invalid token` });
    } else {
      const { result } = await verifyToken(token);
      if (result.user) {
        const Exist = await User.findOne({ email: result?.user });
        if (Exist) {
          const addresses = await Address.find({ user: Exist?._id });
          res
            .status(200)
            .send({
              status: 200,
              message: "Address fetched successfully",
              data: addresses,
            });
        } else {
          res.status(500).send({ status: 500, message: `User not found` });
        }
      } else {
        res.status(500).send({ status: 500, message: `Internal server error` });
      }
    }
  } else {
    res.status(401).send({ status: 401, message: `You are unauthorized` });
  }
});

addressRoute.post("/myaddress/:user/addnew", async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const token2 = req?.params?.user;
  if (token && token2) {
    if (token !== token2) {
      res.status(401).send({ status: 401, message: `Invalid token` });
    } else {
      const { result } = await verifyToken(token);
      if (result.user) {
        const Exist = await User.findOne({ email: result?.user });
        if (Exist) {
          const { name, phone_no, city, locality, district, state, pincode } =
            req.body;
          if (!name || !phone_no || !district || !state || !pincode) {
            res
              .status(400)
              .send({ status: 400, message: "all fields mandatory" });
          } else {
            const newAddress = new Address({
              name,
              phone_no,
              city,
              locality,
              district,
              state,
              pincode,
              user: Exist._id,
            });
            await newAddress.save();
            res
              .status(201)
              .send({
                status: 201,
                message: `New Address added Successfully.`,
              });
          }
        } else {
          res.status(500).send({ status: 500, message: `User not found` });
        }
      } else {
        res.status(500).send({ status: 500, message: `Internal server error` });
      }
    }
  } else {
    res.status(401).send({ status: 401, message: `You are unauthorized` });
  }
  // res.status(200).send({ status: 200, message:{token: token , token2:token2}})
});

addressRoute.put("/myaddress/:user/edit/:addressid", async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const { user, addressid } = req?.params;
  const isValidAdressid = checkValidId(addressid);
  if (!isValidAdressid) {
    return res.status(401).send({ status: 401, message: `Invalid addressid` });
  }
  if (token && user && addressid) {
    if (token !== user) {
      res.status(401).send({ status: 401, message: `Invalid token` });
    } else {
      const { result } = await verifyToken(token);
      if (result.user) {
        const Exist = await User.findOne({ email: result?.user });
        if (Exist) {
          const { name, phone_no, city, locality, district, state, pincode } =
            req.body;
          if (!name || !phone_no || !district || !state || !pincode) {
            res
              .status(400)
              .send({ status: 400, message: "all fields mandatory" });
          } else {
            const updateAddress = await Address.findByIdAndUpdate(
              { _id: addressid, user: Exist?._id },
              { ...req.body }
            );

            if (updateAddress) {
              res
                .status(201)
                .send({
                  status: 201,
                  message: `Address updated Successfully.`,
                });
            } else {
              res
                .status(500)
                .send({ status: 500, message: `No address found` });
            }
          }
        } else {
          res.status(500).send({ status: 500, message: `User not found` });
        }
      } else {
        res.status(500).send({ status: 500, message: `Internal server error` });
      }
    }
  } else {
    res.status(401).send({ status: 401, message: `You are unauthorized` });
  }
});

addressRoute.delete("/myaddress/:user/delete/:addressid", async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const { user, addressid } = req?.params;
  const isValidAdressid = checkValidId(addressid);
  if (!isValidAdressid) {
    return res.status(401).send({ status: 401, message: `Invalid addressid` });
  }
  if (token && user && addressid) {
    if (token !== user) {
      res.status(401).send({ status: 401, message: `Invalid token` });
    } else {
      const { result } = await verifyToken(token);
      if (result.user) {
        const Exist = await User.findOne({ email: result?.user });
        if (Exist) {
          const deleteAddress = await Address.findByIdAndDelete({
            _id: addressid,
            user: Exist?._id,
          });

          if (deleteAddress) {
            res
              .status(201)
              .send({ status: 201, message: `Address deleted Successfully.` });
          } else {
            res.status(500).send({ status: 500, message: `No address found` });
          }
        } else {
          res.status(500).send({ status: 500, message: `User not found` });
        }
      } else {
        res.status(500).send({ status: 500, message: `Internal server error` });
      }
    }
  } else {
    res.status(401).send({ status: 401, message: `You are unauthorized` });
  }
});

module.exports = { addressRoute };
