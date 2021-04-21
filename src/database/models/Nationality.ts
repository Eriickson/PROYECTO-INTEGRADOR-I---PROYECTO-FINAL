import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface INationalitySchema extends Document, IOption {}

const nationalitySchema: Schema<INationalitySchema> = new Schema(
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

export const Nationality = model("Nationality", nationalitySchema);
