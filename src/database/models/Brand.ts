import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IBrandSchema extends Document, IOption {}

const brandSchema: Schema<IBrandSchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Brand = model("Brand", brandSchema);