import mongoose from "mongoose";

async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log(`database connected`);
        
    } catch (error) {
        console.log(error);
        console.error('Error connecting to MongoDB:'), process.exit(1);
    }
    
}

export default dbConnect;