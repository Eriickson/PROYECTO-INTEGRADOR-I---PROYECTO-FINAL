import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { User } from "../../../database";
import { envValues } from "../../../config";

interface ILoginArgs {
  email: string;
  provider: string;
}
interface VerifyTokenNewUserPayloadArgs {
  token: string;
}
interface GenerateTokenArgs {
  email: string;
}

interface SigninArgs {
  identifier: string;
  password: string;
}

export default {
  Query: {
    async login(_: any, { email, provider }: ILoginArgs) {
      try {
        const userFound = await User.findOne({ $and: [{ email }, { profileCompleted: true }, { isDisabled: false }] });

        if (!userFound) {
          const payloadToken = {
            email: email,
          };

          const token = jwt.sign(payloadToken, envValues.tokens.tokenLogin, { expiresIn: "1d" });

          return {
            token,
            isNewUser: true,
          };
        }

        const payload = {
          userId: userFound._id,
          email: userFound.email,
          picture: `${envValues.hostingFiles}/build/${userFound.profilePicture.url}/resolution/${userFound.profilePicture.filename}`,
          name: `${userFound.name} ${userFound.lastname}`,
        };

        console.log(payload);
        console.log(userFound);

        const token = jwt.sign(payload, envValues.tokens.tokenLogin);

        console.log(token);
        return {
          token,
          isNewUser: false,
        };

        console.log("Sigue su camino");
      } catch (err) {
        console.log(err);
      }
    },
    async verifyTokenNewUser(_: any, { token }: VerifyTokenNewUserPayloadArgs) {
      try {
        const { email } = jwt.verify(token, envValues.tokens.tokenLogin) as { email: string };

        const userFound = await User.findOne({ $and: [{ email }] });

        if (userFound) {
          return {
            isNewUser: false,
          };
        }

        return {
          email,
          isNewUser: true,
        };
      } catch (err) {
        console.log(err);
      }
    },
    async generateTokenApiGraphlQL(_: any, { email }: GenerateTokenArgs) {
      try {
        const userFound = await User.findOne({ $and: [{ email }, { profileCompleted: true }, { isDisabled: false }] });

        if (!userFound) {
          console.log("Usuario no encontrado");

          return;
        }
        const payload = {
          userId: userFound._id,
          name: `${userFound.name} ${userFound.lastname}`,
          picture: `${envValues.hostingFiles}/build/${userFound.profilePicture.url}/resolution/${userFound.profilePicture.filename}`,
        };
        const token = jwt.sign(payload, envValues.tokens.tokenAPI);

        return {
          token,
          name: `${userFound.name} ${userFound.lastname}`,
          picture: `${envValues.hostingFiles}/build/${userFound.profilePicture.url}/resolution/${userFound.profilePicture.filename}`,
          userId: userFound._id,
          agencyId: userFound.agency,
        };
      } catch (err) {
        console.log(err);
      }
    },
    async signin(_: any, { identifier, password }: SigninArgs) {
      try {
        const userFound = await User.findOne({
          $and: [{ $or: [{ email: identifier }, { username: identifier }] }, { isDisabled: false }],
        });

        if (!userFound) return new Error("Ha ocurrido un error");

        if (!compareSync(password, userFound.password)) return new Error("Ha ocurrido un error");

        return {
          userId: userFound._id,
          email: userFound.email,
          picture: `${envValues.hostingFiles}/build${userFound.profilePicture.url}/resolution/${userFound.profilePicture.filename}`,
          name: `${userFound.name} ${userFound.lastname}`,
        };
      } catch (err) {
        console.log(err);
      }

      console.log({ identifier, password });
    },
  },
};
