import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/db.js";


dotenv.config();


const app = express();

connectDB(); 

app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import userRoutes from "./routes/user.route.js"

app.use("/users", userRoutes)



export default app; 