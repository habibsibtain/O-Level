import User from "../models/user.model.js";
import {createUser} from "../services/user.services.js"
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }
  const {fullname, email, password} = req.body;
  console.log(req.body)
  const user = await createUser({firstname: fullname.firstname, lastname: fullname.lastname, email, password});

  const token = user.generateAuthToken();
  return res.status(201).json({ user, token }); 
}

export const loginUser = async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  
  const token = user.generateAuthToken(); 
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 
  })
  return res.status(200).json({ user, token });
}

export const getUserProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
}

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
}