import { MongoClient } from "mongodb"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"


const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db()

export const auth = betterAuth({
    database:mongodbAdapter(db,{
        client
    }),
    emailAndPassword:{
        enabled:true
    },
    socialProviders:{
        google:{
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
        }
    }
})