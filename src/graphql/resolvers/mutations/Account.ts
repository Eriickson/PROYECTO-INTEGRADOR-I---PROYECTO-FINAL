import jwt from "jsonwebtoken";
import { IAlertApiGraphQL } from "src/shared";

import { Account, User } from "../../../database";
import { registeredAccount, accountNotExist, invalidCode, confirmedAccount } from "../../../errors";

interface RegisterAccountArgs {
  email: string;
}
interface VerifyAccountArgs {
  email: string;
  code: string;
}

type typeAlert = "SUCCESS" | "WARNING" | "DANGER" | "INFO" | "NEUTRAL" | "BRAND";

interface ResponseType {
  title: string;
  message: string;
  typeAlert: typeAlert;
  labelBtnPri: string;
}

interface ICreateTokenRegisterArgs {
  email: string;
  provider: string;
}

export default {
  Mutation: {
    registerAccount: async (_: any, args: RegisterAccountArgs): Promise<ResponseType> => {
      try {
        const accountFound = await Account.findOne({ email: args.email });

        if (accountFound) {
          if (accountFound.confirmed) {
            throw Error(JSON.stringify(registeredAccount));
          } else {
            await accountFound.updateOne({ code: 999999 });
            return {
              title: "Confirmación enviada",
              message: "Se ha enviado un código a su correo.",
              typeAlert: "SUCCESS",
              labelBtnPri: "Ingresar Código",
            };
          }
        }

        const newAccount = new Account({ email: args.email, code: 999999 });

        await newAccount.save();

        return {
          title: "Confirmación enviada",
          message: "Se ha enviado un código a su correo.",
          typeAlert: "SUCCESS",
          labelBtnPri: "Ingresar Código",
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    verifyAccount: async (_: any, args: VerifyAccountArgs) => {
      const { email, code } = args;

      try {
        // Buscamos la cuenta
        const response = await Account.findOne({ email });

        // Verificamos que la cuenta exista
        if (!response) return new Error(accountNotExist());

        // Verificamos que la cuenta no esté activada
        if (response.confirmed) return new Error(confirmedAccount());

        // Verificamos que el code sea correcto
        if (response.code !== code) return new Error(invalidCode());

        const payload = {
          email,
          code,
        };
        return jwt.sign(payload, `${process.env.TOKEN_VERIFY_ACCOUNT}`, {
          expiresIn: "24h",
        });
      } catch (err) {
        console.log(err);
      }
    },
    createTokenRegister: async (_: any, { email, provider }: ICreateTokenRegisterArgs) => {
      const code = 999999;
      const errorResponse: IAlertApiGraphQL = {
        type: "DANGER",
        message: "Identificador o contraseña incorrecta.",
        isActive: true,
      };

      try {
        // Buscamos al usuario en la base de datos para verificar si ya tiene su perfil completado
        const userFound = await User.findOne({ email });
        if (userFound && userFound.profileCompleted) return new Error("Este perfil ya está completo");

        // Buscamos la cuenta asociada con el correo que se ingresa
        const accountFound = await Account.findOne({ email: email });

        if (accountFound) {
          if (accountFound.confirmed) {
            console.log("Confirmada");

            throw Error(JSON.stringify(errorResponse));
          } else {
            await accountFound.updateOne({ code });
            console.log("Llega aqui");
          }
        } else {
          const newAccount = new Account({ email: email, code, provider });
          await newAccount.save();
        }

        const token = jwt.sign({ email, code }, `${process.env.TOKEN_VERIFY_ACCOUNT}`, {
          expiresIn: "24h",
        });

        console.log(token);

        return {
          token,
        };
      } catch (err) {
        console.log(err);
      }
    },
  },
};
