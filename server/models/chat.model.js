import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        require:true
    },
    userName:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    messages:[
        {
            isImage:{type:Boolean,require:true},
            isPublished:{type:Boolean,default:false},
            role:{type:String,require:true},
            content:{type:String,require:true},
            timestamp:{type:Number,require:true}
        }
    ]

},{
    timestamps:true
})

export const Chat=mongoose.model('Chat',chatSchema)