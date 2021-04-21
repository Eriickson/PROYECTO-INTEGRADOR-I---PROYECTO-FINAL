import jwt from "jsonwebtoken";
import { ICroppedArea } from "src/interfaces";
import { IUploadPromise } from "src/interfaces/File";
import { uploadProfilePicture } from "../../../utils";
import { User, ContactsUs } from "../../../database";
import { envValues } from "../../../config";
import { IncomingHttpHeaders } from "http";
import { fieldDuplicate } from "../../../errors";
interface IRegisterUserArgs {
  user: {
    name: string;
    lastname: string;
    direction: {
      province: number;
      municipality: number;
      sector: number;
    };
    nationality: string;
    birthday: string;
    sex: boolean;
    username: string;
    password: string;
    profilePicture: {
      file: IUploadPromise;
      croppedArea: ICroppedArea;
    };
  };
}

interface IContactsUsArgs {
  userInfo: {
    fullName: String;
    email: String;
    numberPhone: String;
    theme: String;
    message: String;
  };
}

export default {
  Mutation: {
    async registerUser(_: any, { user }: IRegisterUserArgs, { headers }: { headers: IncomingHttpHeaders }) {
      const payload = jwt.verify(headers.authorization?.split(" ")[1] || "", envValues.tokens.tokenLogin) as {
        email: string;
      };

      try {
        const userFoundByUsername = await User.findOne({ username: user.username });
        const userFoundByEmail = await User.findOne({ email: payload.email });

        if (userFoundByUsername) throw new Error(fieldDuplicate("nombre de usuario"));
        if (userFoundByEmail) throw new Error(fieldDuplicate("correo electrónico"));
      } catch (err) {
        return new Error(err);
      }

      try {
        const { croppedArea, file } = user.profilePicture;
        const profilePicture = await uploadProfilePicture(file, croppedArea);

        const newUser = new User({
          name: user.name,
          lastname: user.lastname,
          password: user.password,
          birthday: user.birthday,
          nationality: user.nationality,
          sex: user.sex,
          direction: {
            province: user.direction.province,
            municipality: user.direction.municipality,
            sector: user.direction.sector,
          },
          username: user.username,
          email: payload.email || "",
          profilePicture,
          profileCompleted: true,
        });

        await newUser.save();

        return {
          userCreated: true,
        };
      } catch (err) {
        if (err.code === 11000) {
          const duplicateFieldValue = Object.values(err.keyValue)[0] as string;
          if (Object.keys(err.keyValue)[0] === "username") {
            return fieldDuplicate("nombre de usuario");
          }
        }

        throw new Error(err);
      }
    },
    async contactsUs(_: any, { userInfo }: IContactsUsArgs) {
      try {
        const newContactUs = new ContactsUs({ ...userInfo });
        await newContactUs.save();
        return {
          msg: "Su petición a sido recibida, se le responderá ya sea por número de teléfono o correo electrónico.",
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
