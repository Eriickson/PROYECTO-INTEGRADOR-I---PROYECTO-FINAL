import { Schema, model, Document } from "mongoose";
import { IOption } from "../../interfaces";

export interface ITransmissionSchema extends Document, IOption {}

const transmissionSchema: Schema<ITransmissionSchema> = new Schema(
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

export const Transmission = model("Transmission", transmissionSchema);
