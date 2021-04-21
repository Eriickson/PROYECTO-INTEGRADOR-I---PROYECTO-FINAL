import { Types } from "mongoose";
import { User } from "../../../database";
import { getProvinces, getMunicipalities, getSectors, getNationalities } from "../../../utils";

interface GetMyProfileArgs {
  userId: string;
}

export default {
  Query: {
    async getMyProfile(_: any, { userId }: GetMyProfileArgs) {
      try {
        const userFound = await User.aggregate([
          {
            $match: {
              _id: Types.ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "provinces",
              localField: "direction.province",
              foreignField: "_id",
              as: "direction.province",
            },
          },
          {
            $lookup: {
              from: "countries",
              localField: "nationality",
              foreignField: "_id",
              as: "nationality",
            },
          },
          {
            $lookup: {
              from: "municipalities",
              localField: "direction.municipality",
              foreignField: "_id",
              as: "direction.municipality",
            },
          },
          {
            $lookup: {
              from: "sectors",
              localField: "direction.sector",
              foreignField: "_id",
              as: "direction.sector",
            },
          },
          { $unwind: "$nationality" },
          { $unwind: "$direction.province" },
          { $unwind: "$direction.municipality" },
          { $unwind: "$direction.sector" },
          {
            $project: {
              id: 1,
              profilePicture: 1,
              name: 1,
              lastname: 1,
              username: 1,
              email: 1,
              direction: 1,
              nationality: 1,
              birthday: 1,
              sex: 1,
            },
          },
          {
            $addFields: {
              id: "$_id",
              profilePicture: {
                $concat: [
                  `${process.env.HOSTING_FILES}`,
                  "/build",
                  "$profilePicture.url",
                  "/resolution/",
                  "$profilePicture.filename",
                ],
              },
              "nationality.value": "$nationality._id",
              "direction.province.value": "$direction.province._id",
              "direction.municipality.value": "$direction.municipality._id",
              "direction.sector.value": "$direction.sector._id",
            },
          },
        ]);

        const nationalities = await getNationalities();
        const provinces = await getProvinces();
        const municipalities = await getMunicipalities(userFound[0].direction.province._id);
        const sectors = await getSectors(userFound[0].direction.municipality._id);

        console.log(userFound);

        return {
          user: userFound[0],
          nationalities,
          provinces,
          municipalities,
          sectors,
        };
      } catch (err) {
        console.log(err);

        throw new Error(err);
      }
    },
  },
};
