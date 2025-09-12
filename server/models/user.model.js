import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
     password:{
        type:String,
        require:true
    },
     credits:{
        type:Number,
        default:20
    },
})

// hashing password before saving

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next();
})

export const User=mongoose.model('User',userSchema)