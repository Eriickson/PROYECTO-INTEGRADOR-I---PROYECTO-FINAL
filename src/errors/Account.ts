import { IAlertApiGraphQL } from "../shared";

export const registeredAccount: IAlertApiGraphQL = {
  type: "DANGER",
  message: "Ya hay una cuenta asociada a este correo electrónico.",
  isActive: true,
};

export const accountNotExist = () => {
  const error: IAlertApiGraphQL = {
    type: "DANGER",
    message: "Ya hay una cuenta asociada a este correo electrónico.",
    isActive: true,
  };
  return JSON.stringify(error);
};

export const invalidCode = () => {
  const error: IAlertApiGraphQL = {
    type: "DANGER",
    message: "El código ingresado es inválido.",
    isActive: true,
  };
  return JSON.stringify(error);
};

export const confirmedAccount = () => {
  const error: IAlertApiGraphQL = {
    type: "DANGER",
    message: "Esta cuenta ya ha sido confirmada.",
    isActive: true,
  };
  return JSON.stringify(error);
};

export const accountNotFound = () => {
  const error: IAlertApiGraphQL = {
    type: "DANGER",
    message: "Este correo no tiene una cuenta para ser verificada.",
    isActive: true,
  };
  return JSON.stringify(error);
};

export const fieldDuplicate = (fieldName: string) => {
  const error: IAlertApiGraphQL = {
    type: "DANGER",
    message: `Este ${fieldName} ya está en uso`,
    isActive: true,
  };
  return JSON.stringify(error);
};
