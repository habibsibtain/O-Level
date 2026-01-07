import mongoose from "mongoose";

function connectDB (){
  mongoose.connect(process.env.DB)
  .then(()=>{console.log("Connected to DB")})
  .catch((err)=> console.log("Error in connecting to DB: ", err.message))
}

export default connectDB;