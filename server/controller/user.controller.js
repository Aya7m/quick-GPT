import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { Chat } from '../models/chat.model.js'

// generate token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
export const registUser=async(req,res)=>{
    const{name,email,password}=req.body

    try {
        const existUser=await User.findOne({email})
        if(existUser){
            return res.json({success:false,message:"user already exist"})
        }

        const user=await User.create({name,email,password})
        const token=generateToken(user._id)
        res.json({
            success:true,
            message:"user register successfully ",
            user,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}

// login user
export const loginUser=async(req,res)=>{
    const{email,password}=req.body  
    try {
        const user=await User.findOne({email})
        if(user){
            const isMatch=await bcrypt.compare(password,user.password)
            if(isMatch){
                const token=generateToken(user._id)
                res.json({
                    success:true,
                    message:"user login successfully ",
                    user,
                    token
                })
            }else{
                res.json({success:false,message:"invalid password or email"})
            }
        }else{
            res.json({success:false,message:"user not found"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
    }
}

// get user profile
export const getUserProfile=async(req,res)=>{
    try {
        const user=req.user
        res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
    }
}

// get published images
export const getPublishedImages=async(req,res)=>{
    try {

        const publishedImageMessages=await Chat.aggregate([
            { $unwind: "$messages" },
            { $match: { "messages.isImage": true, "messages.isPublished": true } },
            { $project: { _id: 0, imageUrl: "$messages.content", prompt: "$messages.prompt", userName: "$userName", timestamp: "$messages.timestamp" } },
            { $sort: { timestamp: -1 } }
        ]);
        res.json({success:true,publishedImageMessages})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}