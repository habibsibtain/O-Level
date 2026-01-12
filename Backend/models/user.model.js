import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minLength: [3, "Firstname must be at least 3 characters long"]
    },
    lastname: {
      type: String,
      minLength: [3, "Lastname must be at least 3 characters long"]
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters long"],
    select: false
  },
  socketId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id},
    process.env.JWT_SECRET,
  );
  return token;
}

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const User = mongoose.model("User", userSchema);

export default User;