import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IFuelSchema extends Document, IOption {}

const fuelSchema: Schema<IFuelSchema> = new Schema(
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

export const Fuel = model("Fuel", fuelSchema);
