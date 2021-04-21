import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IColorSchema extends Document, IOption {}

const colorSchema: Schema<IColorSchema> = new Schema(
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

export const Color = model("Color", colorSchema);
