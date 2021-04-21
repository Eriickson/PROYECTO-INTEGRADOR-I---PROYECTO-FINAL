import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";

const publicationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "VehicleCategory",
    },
    uuid: {
      type: String, // 36
      required: true,
      default: uuid(),
    },
    tags: [String],
    status: {
      type: Boolean,
      default: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
    },
    model: {
      type: Schema.Types.ObjectId,
      ref: "Models",
    },
    typeModel: {
      type: Schema.Types.ObjectId,
      ref: "typeModels",
    },
    year: {
      type: Number,
      required: true,
    },
    cover: {
      filename: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    mileage: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String, // KM - MI
        required: true,
      },
    },
    fuel: {
      type: Schema.Types.ObjectId,
      ref: "Fuels",
    },
    transmission: {
      type: Schema.Types.ObjectId,
      ref: "Transmissions",
    },
    cylinders: {
      type: Number,
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
    },
    doors: {
      type: Number,
      required: true,
    },
    traction: {
      type: Schema.Types.ObjectId,
      ref: "Tractions",
    },
    accessories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Accessories",
      },
    ],
    paintColor: {
      type: Schema.Types.ObjectId,
      ref: "Colors",
    },
    interiorColor: {
      type: Schema.Types.ObjectId,
      ref: "Colors",
    },
    includeds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Includeds",
      },
    ],
    images: [
      {
        filename: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        createdAt: {
          type: String,
          default: Math.ceil(Date.now() / 1000).toString(),
        },
        disabled: Boolean,
      },
    ],
    pricing: {
      currency: String, // currency
      amount: Number, // amount
    },
    condition: {
      type: Schema.Types.ObjectId,
      ref: "Condition",
    }, // nuevo usado semiusado
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "Features",
      },
    ],
    visits: {
      type: Number,
      default: 0,
    },
    removedAt: {
      option: String,
      timestamp: String, // removedAt
    },
    isDisabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
    },
    scores: [
      {
        title: String,
        score: Number,
      },
    ],
    version: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Post = model("Post", publicationSchema);
