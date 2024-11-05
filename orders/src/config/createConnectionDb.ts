import mongoose from "mongoose";

export const createConnectionDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};
