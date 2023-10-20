const express= require('express');
const cors= require('cors');
const { connection } = require('./config/db');
const { userRoute } = require('./routes/userRoute');
const { admin } = require('./routes/adminRoute');
const { addressRoute } = require('./routes/addressRoute');
const { productsRoute } = require('./routes/productRoute');
const { cartRoute } = require('./routes/CartRoute');
const { categoryRoute } = require('./routes/category');
require('dotenv').config();

const PORT= process.env.PORT || 5000
const app= express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/',(req, res) =>{
    res.status(200).send('Welcome to the ecomm api')
});

app.use('/user/auth', userRoute);
app.use('/admin',admin);
app.use('/address', addressRoute);
app.use('/products', productsRoute);
app.use('/cart',cartRoute);
app.use('/categories',categoryRoute);

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log(`DB connected successfully.App is listening on ${PORT}`);
    } catch(err){
        console.log("DB connection failed",err)
    }
})


