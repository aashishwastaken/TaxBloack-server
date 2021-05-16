const express = require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const cors=require('cors');


const authApis=require('./routes/authApis');
const loansApis=require('./routes/loansApis');
const auth = require('./auth/auth');

dotenv.config();

mongoose.connect(process.env.DB,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
mongoose.connection.on('error',(err)=>console.log(err));



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use('/users',authApis);
app.use('/loans',auth,loansApis);

app.use('/', auth,(req,res)=>{
    res.send('Welcome '+req.user.email);
});

app.listen(process.env.PORT || 8081, () => console.log(`Server listening on port port! http://localhost:${process.env.PORT}`));