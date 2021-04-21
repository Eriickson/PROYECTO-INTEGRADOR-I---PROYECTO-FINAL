export interface IAlertApiGraphQL {
  type: "DANGER" | "WARNING" | "SUCCESS";
  isActive: boolean;
  message: string;
  redirect?: string;
}
