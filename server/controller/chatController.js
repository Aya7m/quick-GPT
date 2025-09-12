import { Chat } from "../models/chat.model.js"

// create new chat
export const createChat=async(req,res)=>{
    try {
        const userId=req.user._id

        const chatData={
            userId,
            messages:[],
            userName:req.user.name,
            name:`New Chat ${Date.now()}`

        }
        const chat=await Chat.create(chatData)
        res.json({success:true,message:"chat created successfully",chat})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}

// get all chats
export const getAllChats=async(req,res)=>{
    try {
        const userId=req.user._id
        const chats=await Chat.find({userId}).sort({updatedAt:-1})
        res.json({success:true,chats})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}

// delete chat
export const deleteChat=async(req,res)=>{
    try {
        const userId=req.user._id
        const {chatId}=req.body
        await Chat.findOneAndDelete({userId,_id:chatId})
        res.json({success:true,message:"chat deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}
