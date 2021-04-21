import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";

const AgencySchema = new Schema(
  {
    uuid: {
      type: String, // 36
      required: true,
      default: uuid(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      filename: {
        type: String,
        required: true, // 100x75 - 400x300 - 800x600
      },
      url: {
        // wwww.gcp.com/automarket-rd/agency/logo/x600/123e4567-e89b-12d3-a456-426655440000.jpg
        type: String,
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
        default: Math.ceil(Date.now() / 1000).toString(),
      },
    },
    slogan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
    occupation: {
      type: String,
      default: "SALE",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDisabled: {
      default: false,
      type: Boolean,
      required: true,
    },
    ubication: {
      direction: {
        province: {
          type: Schema.Types.ObjectId,
          ref: "Provinces",
        },
        municipality: {
          type: Schema.Types.ObjectId,
          ref: "Municipality",
        },
        sector: {
          type: Schema.Types.ObjectId,
          ref: "Sectors",
        },
        reference: String,
      },
    },
    contacts: {
      numberPhones: [
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
      ],
      emails: [
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
          },
        },
      ],
    },
    isProfessional: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Agency = model("Agency", AgencySchema);
