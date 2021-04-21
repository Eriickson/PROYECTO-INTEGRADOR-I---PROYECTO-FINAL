import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface ICountrySchema extends Document, IOption {}

const countrySchema: Schema<ICountrySchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
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

export const Country = model("Country", countrySchema);
