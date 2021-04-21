import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface IMunicipalitySchema extends Document, IOption {}

const municipalitySchema: Schema<IMunicipalitySchema> = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: "Province",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Municipality = model("Municipality", municipalitySchema);
