import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface VehicleCategorySchema extends Document, IOption {}

const vehicleCategorySchema: Schema<VehicleCategorySchema> = new Schema(
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

export const VehicleCategory = model("VehicleCategory", vehicleCategorySchema);
