import { Schema, model, Document } from "mongoose";

export interface IAccount extends Document {
  email: string;
  code: string;
  sent: string;
  confirmed: string | null;
}

export interface IAccountSchema extends Document, IAccount {}

const accountSchema: Schema<IAccountSchema> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Debe ingresar su dirección de correo electrónico"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    sent: {
      type: String,
      required: true,
      default: `${parseInt(`${Date.now() / 1000}`)}`,
    },
    confirmed: String,
  },
  { versionKey: false, timestamps: true },
);

export const Account = model("Account", accountSchema);
