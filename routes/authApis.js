const express = require('express');
const jwt=require('jsonwebtoken');
const auth = require('../auth/auth');

const UserModel = require('../models/users.model');

let routes = express.Router();

let login = async (email, password) => {

    try {
        let user = await UserModel.findOne({ email });
      
        if (!user) {
            return { success: false, message: 'No users found for this email' };
        }
        if (! await user.isValidPassword(password)) {
            return { success: false, message: 'Wrong password' };
        }

        const token= jwt.sign({id:user._id,name:user.name,email:user.email},process.env.JWTSecret,{expiresIn:'1h'});
        
        return { success: true, user:{name:user.name,email:user.email,token} };
    } catch (err) {

        return { success: false, message: err };
    }

}

routes.post('/register',
    async (req, res, next) => {
        const { name, email, password, cpassword, contact, address } = req.body;
        // console.log(email, password, 'register');
        try {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                throw new Error('Enter a valid email');
            }
            if (!name) {
                throw new Error('Enter a name');
            }
            if (!password) {
                throw new Error('Enter a password');
            }
            if (password!=cpassword) {
                throw new Error('Password and confirm password should match');
            }
            if (!contact) {
                throw new Error('Enter a contact number');
            }
            if (!address) {
                throw new Error('Enter a address');
            }

            let user = await UserModel.create({ name, email, password, contact, address });
            console.error('user', user);
            let resData = await login(email, password);
            console.log(resData);
            res.json(resData);

        } catch (err) {
            if (err.code === 11000) {
                res.json({ success: false, message: 'User already exists with that email' });
            } else {

                res.json({
                    success: false, message: err.message
                });
            }
        }
    }
);

routes.post('/login',
    async (req, res) => {
        const { email, password } = req.body;
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return res.json({ success: false, message: 'Enter a valid email' });
        }
        if (!password) {
            return res.json({ success: false, message: 'Enter a password'});
        }
        let resData = await login(email, password);
        console.log(resData);
        res.json(resData);

    });

routes.post('/isTokenValid',auth,(req,res)=>{
    let user=UserModel.findOne({email:req.user.email});
    if(!user){
        return res.json({success:false});
    }else{
        return res.json({success:true});
    }
})    

module.exports = routes;