import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import Captain from "../models/captain.model.js"

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" })
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedToken._id)
    if (!user) {
      return res.status(401).json({ message: "Invalid access token" })
    }
    req.user = user
    next()
  } catch (error) {
    console.error("Error in authUser middleware:", error)
    return res.status(401).json({ message: "Invalid access token" })
  }
}

export const authCaptain = async (req, res, next ) => {
  const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "")
  if(!token){
    return res.status(401).json({ message: "Unauthorized request" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await Captain.findById(decodedToken._id)
    if(!captain){
      return res.status(401).json({ message: "Invalid access token"})
    }
    req.captain = captain;
    next();
  } catch (error) {
    console.error("Error in authCaptain middleware:", error)
    return res.status(401).json({ message: "Invalid access token" });
  }
}