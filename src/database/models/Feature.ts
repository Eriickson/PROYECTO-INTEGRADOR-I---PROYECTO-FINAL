import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IFeatureSchema extends Document, IOption {}

const featureSchema: Schema<IFeatureSchema> = new Schema(
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

export const Feature = model("Feature", featureSchema);
