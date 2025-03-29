import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  subjects: [String], // List of subjects user studies
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

UserSchema.index({ location: "2dsphere" }); // Enable geospatial queries

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
