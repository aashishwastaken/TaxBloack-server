const express = require('express');
const auth = require('../auth/auth');

const UserModel = require('../models/users.model');

let routes = express.Router();



routes.post('/new',
    async (req, res, next) => {
        const {	 amount,strt,exp,emi,fixed } = req.body;
        // console.log(email, password, 'register');
        try {
            
            if (!amount) {
                throw new Error('Enter an amount');
            }
            if (!strt) {
                throw new Error('Enter starting date');
            }
            if (!exp) {
                throw new Error('Enter expirying date');
            }
            if (!fixed) {
                throw new Error('Is it fixed or floating');
            }
            if (new Date(exp)<new Date(strt)) {
                throw new Error('Starting date is bigger than expirying date');
            }
            let loan={
                amount,
                strt,
                exp,
                emi,
                fixed,
                issuedOn:new Date()
            };            

             await UserModel.updateOne({ email: req.user.email },{$push:{loans:loan}}).then((doc)=>{
            //    if (err) {
            //        throw new Error(err);
            //    }
                if(!doc){
                  return res.json({ success: false, message: 'No users found for this email' });
               }else{
                  return res.json({ success: true, loan });
                   
               }
            });
            // console.error('user', loans);
           

            

           

        } catch (err) {
            if (err.code === 11000) {
                return res.json({ success: false, message: 'User already exists with that email' });
            } else {

                return res.json({
                    success: false, message: err.message
                });
            }
        }
    }
);


routes.get('/all',
    async (req, res, next) => {
        const { user } = req;

        try {
            let {loans} = await UserModel.findOne({ email: user.email }, 'loans');
            loans.sort((a,b)=>new Date(a.issuedOn)>new Date(b.issuedOn)?-1:1);
            if (!loans) {
                return res.json({ success: false, message: 'No users found for this email' });
            }
           
          return res.json({ success: true, loans });


        } catch (err) {

            return res.json({ success: false, message: err });
        }

    });



module.exports = routes;