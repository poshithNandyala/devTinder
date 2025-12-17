
import mongoose from "mongoose";
export const connectDB = async () => {
        await mongoose.connect("mongodb+srv://poshithiiitl_db_user:mrDJuoiqPeEkPIYi@cluster0.felsdms.mongodb.net/?appName=Cluster0/devtinder");
        console.log("MongoDB connected successfully");
    
};  
