import mongoose from "mongoose";

const municipalitySchema = new mongoose.Schema(
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
    governorate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Governorate",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Municipality = mongoose.model("Municipality", municipalitySchema);

export default Municipality;
