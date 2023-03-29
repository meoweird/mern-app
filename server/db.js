import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@mern.aseyi3c.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Connected DB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
