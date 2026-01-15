import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";


dotenv.config();


const app = express();

connectDB(); 

app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


import userRoutes from "./routes/user.route.js"
import captainRoutes from "./routes/captain.route.js"

app.use("/users", userRoutes)
app.use("/captains", captainRoutes)



export default app; 