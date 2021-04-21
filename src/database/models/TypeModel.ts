import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface ITypeModelSchema extends Document, IOption {}

const typeModelSchema: Schema<ITypeModelSchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: Schema.Types.ObjectId,
      ref: "Models",
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

export const TypeModel = model("TypeModel", typeModelSchema);
