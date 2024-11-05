import mongoose from "mongoose";

const createDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database");
  }
};

export default createDatabase;
