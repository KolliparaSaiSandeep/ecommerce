import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.mongourl);
        console.log("Successfully connected");
    }
    catch(error){
        console.log("Error in mongodb",error);
    }
}
export default connectDB;