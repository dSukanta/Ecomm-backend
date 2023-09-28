const express= require('express');
const cors= require('cors');
const { connection } = require('./config/db');
const { userRoute } = require('./routes/userRoute');
require('dotenv').config();

const PORT= process.env.PORT || 5000
const app= express();
app.use(cors());
app.use(express.json());



app.get('/',(req, res) =>{
    res.status(200).send('Welcome to the ecomm api')
});

app.use('/auth', userRoute);

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log(`DB connected successfully.App is listening on ${PORT}`);
    } catch(err){
        console.log("DB connection failed",err)
    }
})


