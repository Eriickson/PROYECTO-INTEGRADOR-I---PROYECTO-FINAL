import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, resp: Response, next: NextFunction): void => {
  next();
};

export default loggerMiddleware;
