import mongoose  from "mongoose";

// Connect to the database:
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Connecting to database"));

    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB;