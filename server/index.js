import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'
import chatRoute from './routes/chatRoute.js'
import messageRoute from './routes/messageRoute.js'
import creditRouter from './routes/creditRoute.js'
import { stripeWebhook } from './controller/webhook.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT

connectDB()

// stripe webhook
app.post('/api/stripe', express.raw({type:'application/json'}),stripeWebhook)

app.use('/api/user',userRouter)
app.use('/api/chat',chatRoute)
app.use('/api/message',messageRoute)
app.use('/api/credit',creditRouter)

console.log("Public Key:", process.env.IMAGE_KIT_PUBLIC_KEY);
console.log("Private Key:", process.env.IMAGE_KIT_PRIVATE_KEY);
console.log("URL Endpoint:", process.env.IMAGE_KIT_URL_ENDPOINT);


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))