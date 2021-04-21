import { Types } from "mongoose";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { User, Agency } from "../database";

export interface IRequiresLogin {
  isAuth: {
    value: boolean;
    status: "UNAUTHORIZED" | "AUTHORIZED";
  };
  user: {
    email: string;
    userId: string;
    password: string;
    agencyId: string;
  };
  agency: {
    agencyId: string;
    uuid: string;
    occupation: string;
    isDisabled: boolean;
    isProfessional: boolean;
  };
}

export type IRequiresLoginCtx = Request & IRequiresLogin;

export const requiresLogin = (resolver: any) => {
  return async (parent: any, args: any, ctx: Request, info: any) => {
    const agencyFound = {};
    interface IPayload {
      userId: string;
      email: string;
    }

    console.log(ctx.headers.authorization);

    try {
      const payload = jwt.verify(
        ctx.headers.authorization?.split(" ")[1] || "",
        `${process.env.TOKEN_LOGIN}`,
      ) as IPayload;

      console.log(payload);

      const userFound = await User.aggregate([
        {
          $match: {
            $or: [{ _id: Types.ObjectId(payload.userId) }, { email: payload.email }],
            isDisabled: false,
          },
        },
        // {
        //   $lookup: {
        //     from: "agencies",
        //     localField: "agency",
        //     foreignField: "_id",
        //     as: "agency",
        //   },
        // },
        // { $unwind: "$agency" },
        {
          $project: {
            user: {
              email: "$email",
              userId: "$_id",
              password: "$password",
              agency: "$agency",
            },
            // agency: {
            //   agencyId: "$agency._id",
            //   uuid: "$agency.uuid",
            //   occupation: "$agency.occupation",
            //   isDisabled: "$agency.isDisabled",
            //   isProfessional: "$agency.isProfessional",
            // },
          },
        },
      ]);

      // if(userFound[0].agency) {
      //   agencyFound = await Agency.findOne()
      // }
      console.log(userFound);

      if (userFound.length !== 0) {
        return resolver(
          parent,
          args,
          {
            ...ctx,
            user: userFound[0].user,
            agency: userFound[0].agency,
            isAuth: { status: "AUTHORIZED", value: true },
          },
          info,
        );
      } else {
        return resolver(parent, args, { ...ctx, isAuth: { status: "UNAUTHORIZED", value: false } }, info);
      }
    } catch (err) {
      console.log(err);

      return resolver(parent, args, { ...ctx, isAuth: { status: "UNAUTHORIZED", value: false } }, info);
    }
  };
};
