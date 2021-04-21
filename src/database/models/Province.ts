import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IProvinceSchema extends Document, IOption {}

const provinceSchema: Schema<IProvinceSchema> = new Schema(
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

export const Province = model("Province", provinceSchema);
