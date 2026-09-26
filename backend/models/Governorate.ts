import mongoose from "mongoose";

const governorateSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Governorate = mongoose.model("Governorate", governorateSchema);

export default Governorate;
