import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface ISectorSchema extends Document, IOption {}

const sectorSchema: Schema<ISectorSchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Sector = model("Sector", sectorSchema);
