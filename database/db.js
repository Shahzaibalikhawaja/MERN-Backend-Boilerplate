import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection_instance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`);
        console.log(`\nMongoDB Connected! DB Host: ${connection_instance.connection.host}`);
    } catch (error) {
        console.log("\nMongoDB Connection Failed: ", error);
        process.exit(1);
    }
};

export default connectDB;