import axios from "axios"
import { Chat } from "../models/chat.model.js"
import { User } from "../models/user.model.js"
import imagekit from "../config/imageKite.js"
import openai from "../config/openai.js"

export const textMessageController=async(req,res)=>{
    try {
        const userId=req.user._id
        if(req.user.credits<=1){
            return res.json({success:false,message:"not enough credits to send text message"})
        }
        const{chatId,prompt}=req.body
        
        const chat=await Chat.findOne({userId,_id:chatId})
        chat.messages.push({role:'user',content:prompt,timestamp:Date.now(),isImage:false})
        
        const {choices} = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: prompt,
        },
    ],
});
        
const replay={...choices[0].message,timestamp:Date.now(),isImage:false}
        chat.messages.push(replay)
         res.json({success:true,message:"message sent successfully",replay})

        await chat.save()
        await User.findByIdAndUpdate({_id:userId},{ $inc: {credits: -1 } });
       
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}

// image message controller
export const imageMessageController=async(req,res)=>{
    try {
        const userId=req.user._id
        if(req.user.credits<=2){
            return res.json({success:false,message:"not enough credits to send image message"})
        }
        const{chatId,prompt,isPublished}=req.body
        // find chat
        const chat=await Chat.findOne({userId,_id:chatId})

        // push user message to chat
        chat.messages.push({role:'user',content:prompt,timestamp:Date.now(),isImage:false})
        // Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Generate image using ImageKit
        const generatedImageUrl=`${process.env.IMAGE_KIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-400,h-400`;
        
      const aiImageResponse=  await axios.get(generatedImageUrl, { responseType: 'arraybuffer' });
      
    //   convert image to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        // upload image to imagekit
        const imagekitResponse=await imagekit.upload({
            file:base64Image,
            fileName:`quickgpt/${Date.now()}.png`,
            folder:"quickgpt"
        })

        const replay={role:'assistant',content:imagekitResponse.url,timestamp:Date.now(),isImage:true,isPublished}
        res.json({success:true,message:"message sent successfully",replay})
        chat.messages.push(replay)
        await chat.save()
        await User.findByIdAndUpdate({_id:userId},{ $inc: {credits: -2 } });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"something went wrong",error})
        
    }
}