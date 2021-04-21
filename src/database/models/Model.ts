import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IModelSchema extends Document, IOption {}

const modelSchema: Schema<IModelSchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Model = model("Model", modelSchema);
