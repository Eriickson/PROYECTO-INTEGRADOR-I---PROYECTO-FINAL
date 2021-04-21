import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IVersionSchema extends Document, IOption {}

const versionSchema: Schema<IVersionSchema> = new Schema(
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

export const Version = model("Version", versionSchema);
