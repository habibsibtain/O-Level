import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"]
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Lastname must be at least 3 characters long"]
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email address"]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "on-trip"],
    default: "unavailable"
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"]
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "License plate must be at least 3 characters long"]
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"]
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["bike", "car", "auto"]
    }
  },
  location: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  }
})

captainSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id,  },
    process.env.JWT_SECRET,
  );
  return token;
}

captainSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}


export default  Captain = mongoose.model("Captain", captainSchema);