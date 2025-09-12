import Stripe from "stripe";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
export const stripeWebhook=async(request,response)=>{
    const stripe= new Stripe(process.env.STRIPE_API_KEY)
    const signature=request.headers['stripe-signature']

    let event;
    try {
        event=stripe.webhooks.constructEvent(request.body,signature,process.env.STRIPE_WEBHOOK_SECRIT)
    } catch (error) {
        console.log(error)
        return response.status(400).send(`webhook error:${error.message}`)
        
    }

    try {
        switch(event.type){
            case "payment_intent.succeeded":{
                const paymentIntent=event.data.object
               const sessionList= await stripe.checkout.sessions.list({
                    payment_intent:paymentIntent.id,
                    limit:1
                })
                const session=sessionList.data[0]
                if(!session){
                    throw new Error("session not found")
                }
                const{transactionId,appId}=session.metadata;
                if(appId!=="quickgpt"){
                   const transaction= await Transaction.findOne({_id:transactionId,isPaid:false})
                        // update credit in user account and transaction
                await User.updateOne({_id:transaction.userId},{$inc:{credits:transaction.credits}})

                // update credit payment status
                transaction.isPaid=true
                await transaction.save()
                }else{
                    return response.json({received:true,message:"invalid app id"})
                }
                break;

           
                
            }
                
               
                default:
                console.log(`unhandled event type ${event.type}`);

                break;
        }
        response.json({received:true})
        
    } catch (error) {
        console.log(error)
        return response.status(500).send(`webhook error:${error.message}`)
        
    }
   
}