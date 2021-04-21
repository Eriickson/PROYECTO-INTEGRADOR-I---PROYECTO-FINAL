import jwt from "jsonwebtoken";

import { Account } from "../../../database";
import { IAlertApiGraphQL } from "../../../shared";
import { accountNotFound, invalidCode } from "../../../errors";

interface RegisterAccountArgs {
  email: string;
}

type typeAlert = "SUCCESS" | "WARNING" | "DANGER" | "INFO" | "NEUTRAL" | "BRAND";

interface ResponseType {
  title: string;
  message: string;
  typeAlert: typeAlert;
}

interface VerifyAccountArgs {
  email: string;
  code: string;
}

interface VerifyTokenNewAccountArgs {
  token: string;
}

export default {
  Query: {
    registerAccount: async (_: any, args: RegisterAccountArgs): Promise<ResponseType> => {
      const errorResponse: IAlertApiGraphQL = {
        type: "DANGER",
        message: "Identificador o contraseña incorrecta.",
        isActive: true,
      };
      try {
        const accountFound = await Account.findOne({ email: args.email });
        console.log(accountFound);

        if (accountFound) {
          if (accountFound.confirmed) {
            throw Error(JSON.stringify(errorResponse));
          } else {
            await accountFound.updateOne({ code: 999999 });
            return {
              title: "Confirmación enviada",
              message: "Se ha enviado un código a su correo.",
              typeAlert: "SUCCESS",
            };
          }
        }

        const newAccount = new Account({ email: args.email, code: 999999 });

        await newAccount.save();

        return {
          title: "Confirmación enviada",
          message: "Se ha enviado un código a su correo.",
          typeAlert: "SUCCESS",
        };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    verifyAccount: async (_: any, args: VerifyAccountArgs) => {
      const { email, code } = args;

      try {
        // Buscamos la cuenta
        const response = await Account.findOne({ $and: [{ email }, { confirmed: null }] });

        // Verificamos que la cuenta exista
        if (!response) return new Error(accountNotFound());

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
    verifyTokenNewAccount: async (_: any, { token }: VerifyTokenNewAccountArgs) => {
      try {
        type PayloadType = {
          email: string;
          code: string;
        };
        const { code, email } = jwt.verify(token, `${process.env.TOKEN_VERIFY_ACCOUNT}`) as PayloadType;

        console.log({ code, email });

        const accountFound = await Account.findOne({
          $and: [{ code }, { email }, { confirmed: null }],
        });
        console.log(accountFound);

        if (!accountFound) {
          console.log("Esta cuenta ya está verificada");
          return;
        }

        return email;
      } catch (err) {
        throw new Error("Ha ocurrido un error inesperado");
      }
    },
  },
};
