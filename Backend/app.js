import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/db.js";


dotenv.config();


const app = express();

connectDB(); 

app.use(cors()) 

app.get('/', (req, res)=>{
  res.send("Hello")
})

export default app; 