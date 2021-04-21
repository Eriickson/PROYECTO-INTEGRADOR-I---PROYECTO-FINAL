import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserSchema extends Document {
  password: string;
}

const UserSchema: Schema<IUserSchema> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    nationality: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
    },
    sex: {
      type: String,
      required: true,
    },
    direction: {
      province: {
        type: Schema.Types.ObjectId,
        ref: "Province",
      },
      municipality: {
        type: Schema.Types.ObjectId,
        ref: "Municipality",
      },
      sector: {
        type: Schema.Types.ObjectId,
        ref: "Sector",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilePicture: {
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
    },
    contacts: {
      telephoneNumbers: [
        {
          title: String,
          value: String,
        },
      ], // +1 (809 o 829 o 849)  ###-#### +1 (849) 816-0959
      emails: [
        {
          title: String,
          value: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
          },
        },
      ],
    },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Publication",
      },
    ],
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
    },
    useType: {
      type: String,
      require: true,
      enum: ["AGENCY", "PERSONAL"],
      default: "PERSONAL",
    },
    inabilitedAt: [
      {
        msg: {
          type: String,
          required: true,
        },
        inabilitedAt: String,
        endsIn: String,
        enabled: String,
      },
    ],
    isDisabled: {
      required: true,
      type: Boolean,
      default: false,
    },
    removedAt: {
      msg: String,
      timestamp: String,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    provider: String,
    type: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(12, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

export const User = model("User", UserSchema);
