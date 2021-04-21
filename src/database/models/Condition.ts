import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IConditionSchema extends Document, IOption {}

const featureSchema: Schema<IConditionSchema> = new Schema(
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

export const Condition = model("Condition", featureSchema);
