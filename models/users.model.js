const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{type:String, required:true, unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    contact:{type: String,
        validate: {
          validator: function(v) {
            return /\d{10}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    address:{type:String,required:true},
    loans:[],
    updated_at: {type: Date, default: Date.now}
});

UserSchema.pre('save',async function(next){
    // console.log('process.env.SALT',process.env.SALT);
    this.password=await bcrypt.hash(this.password, await bcrypt.genSalt(Number(process.env.SALT)));
    this.loans=[];
    next();
});

UserSchema.methods.isValidPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}



module.exports=mongoose.model('users',UserSchema);