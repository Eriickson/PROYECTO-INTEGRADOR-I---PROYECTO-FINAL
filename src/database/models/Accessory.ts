import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IAccessorySchema extends Document, IOption {}

const accessorySchema: Schema<IAccessorySchema> = new Schema(
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

export const Accessory = model("Accessory", accessorySchema);
