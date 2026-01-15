import express from "express";
import { body } from "express-validator";
import { captainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js";
import { authCaptain } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.plate").notEmpty().withMessage("Vehicle license plate is required"),
    body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be at least 1"),
    body("vehicle.vehicleType").isIn(["bike", "car", "auto"]).withMessage("Valid vehicle type is required")
  ],
  registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  loginCaptain
)

router.get(
  "/profile",
  authCaptain,
  captainProfile
)

router.get(
  "logout",
  authCaptain,
  logoutCaptain
)


export default router;