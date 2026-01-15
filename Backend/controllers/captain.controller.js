import Captain from '../models/captain.model.js';
import { createCaptain } from '../services/captain.services.js';
import { cookie, validationResult } from 'express-validator';

export const registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainExist = await Captain.findOne({ email });
  if (isCaptainExist) {
    return res.status(400).json({ message: "Captain with this email already exists" });
  }

  const hashPassword = await Captain.hashPassword(password);

  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
}

export const loginCaptain = async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email}).select("+password");

  if(!captain){
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await captain.comparePassword(password);

  if(!isPasswordValid){
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token)

  res.status(200).json({ token, captain });
}

export const captainProfile = async (req, res) => {
  res.status(200).json({ captain: req.captain })
}

export const logoutCaptain = async (req, res) => {
  res.clearCookie("token")
  return res.status(200).json({ message: "Logged out successfully" });
}