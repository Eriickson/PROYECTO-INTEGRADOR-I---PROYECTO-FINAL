import { Schema, model } from "mongoose";

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      currency: {
        type: String,
        required: true,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
    benefits: {
      posts: {
        type: Number,
        required: true,
      },
      postLimit: {
        type: Number,
        required: true,
      },
      images: {
        type: Number,
        required: true,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Plan = model("Plan", planSchema);
