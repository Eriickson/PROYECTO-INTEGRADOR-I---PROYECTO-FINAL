import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface ITractionSchema extends Document, IOption {}

const tractionSchema: Schema<ITractionSchema> = new Schema(
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

export const Traction = model("Traction", tractionSchema);
