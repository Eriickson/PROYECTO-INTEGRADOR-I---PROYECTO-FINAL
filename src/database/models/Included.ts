import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IIncludedSchema extends Document, IOption {}

const includedSchema: Schema<IIncludedSchema> = new Schema(
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

export const Included = model("Included", includedSchema);
