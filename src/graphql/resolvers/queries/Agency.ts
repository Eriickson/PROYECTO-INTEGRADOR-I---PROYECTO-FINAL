import { Types } from "mongoose";
import { Agency, User, Post } from "../../../database";

interface SearchAgencyArgs {
  filter: {
    name: string;
    isProfessional: boolean;
    occupation: "SALE" | "RENT";
  };
}

interface GetAgencyArgs {
  uuid: string;
}

interface GetMyAgencyArgs {
  userId: string;
}

interface GetAgencyProfileArgs {
  uuid: string;
}

export default {
  Query: {
    async getMyAgency(_: any, { userId }: GetMyAgencyArgs) {
      console.log(userId);

      try {
        const userFound = await User.findOne({
          $and: [{ _id: userId }, { isDisabled: false }, { profileCompleted: true }],
        });

        if (!userFound) {
          console.log(userFound);

          console.log("Error al buscar al usuario");

          return;
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const agencyFound = await Agency.aggregate([
          {
            $match: {
              owner: Types.ObjectId(userId),
              isDisabled: false,
            },
          },
          {
            $addFields: {
              id: "$_id",
              logo: {
                $concat: [`${process.env.HOSTING_FILES}`, "/build", "$logo.url", "/resolution/", "$logo.filename"],
              },
            },
          },
        ]);

        return {
          myAgency: agencyFound[0],
        };
      } catch (err) {}
    },
    searchAgency: async (_: any, { filter }: SearchAgencyArgs) => {
      try {
        const agenciesFounds = await Agency.aggregate([
          {
            $match: {
              name: { $regex: filter.name, $options: "i" },
              isProfessional: filter.isProfessional,
              occupation: filter.occupation,
            },
          },
          { $limit: 7 },
          {
            $project: {
              id: "$_id",
              uuid: 1,
              name: 1,
              logo: "$logo",
              slogan: 1,
              slug: {
                $replaceAll: {
                  input: "$name",
                  find: " ",
                  replacement: "-",
                },
              },
            },
          },
          {
            $addFields: {
              slug: {
                $toLower: "$slug",
              },
              logo: {
                $concat: [`${process.env.HOSTING_FILES}`, "/build", "$logo.url", "/resolution/", "$logo.filename"],
              },
            },
          },
        ]);

        return agenciesFounds;
      } catch (err) {}
    },
    getAgency: async (_: any, { uuid }: GetAgencyArgs) => {
      try {
        const agencyFounds = await Agency.aggregate([
          {
            $match: {
              uuid,
              isDisabled: false,
            },
          },
          {
            $project: {
              id: "$_id",
              uuid: 1,
              name: 1,
              logo: "$logo",
              slogan: 1,
              contacts: 1,
              slug: {
                $replaceAll: {
                  input: "$name",
                  find: " ",
                  replacement: "-",
                },
              },
            },
          },
          {
            $addFields: {
              slug: {
                $toLower: "$slug",
              },
              logo: {
                $concat: [`${process.env.HOSTING_FILES}`, "/build", "$logo.url", "/resolution/", "$logo.filename"],
              },
            },
          },
        ]);

        return agencyFounds[0];
      } catch (err) {}
    },
    async getAgencyProfile(_: any, { uuid }: GetAgencyProfileArgs) {
      let postsFound;
      try {
        const agencyFound = await Agency.aggregate([
          { $match: { uuid: uuid } },
          {
            $lookup: {
              from: "provinces",
              localField: "ubication.direction.province",
              foreignField: "_id",
              as: "ubication.direction.province",
            },
          },
          {
            $lookup: {
              from: "municipalities",
              localField: "ubication.direction.municipality",
              foreignField: "_id",
              as: "ubication.direction.municipality",
            },
          },
          {
            $lookup: {
              from: "sectors",
              localField: "ubication.direction.sector",
              foreignField: "_id",
              as: "ubication.direction.sector",
            },
          },
          { $unwind: "$ubication.direction.province" },
          { $unwind: "$ubication.direction.municipality" },
          { $unwind: "$ubication.direction.sector" },
          {
            $addFields: {
              id: "$_id",
              slug: {
                $toLower: "$slug",
              },
              logo: {
                $concat: [`${process.env.HOSTING_FILES}`, "/build", "$logo.url", "/resolution/", "$logo.filename"],
              },
            },
          },
        ]);
        console.log(JSON.stringify(agencyFound, null, 4));

        if (agencyFound.length) {
          postsFound = await Post.aggregate([
            {
              $match: {
                isDisabled: false,
                agency: Types.ObjectId(agencyFound[0]._id),
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
            { $lookup: { from: "models", localField: "model", foreignField: "_id", as: "model" } },
            { $unwind: "$brand" },
            { $unwind: "$model" },
            {
              $project: {
                id: "$_id",
                uuid: 1,
                brand: 1,
                model: 1,
                year: 1,
                pricing: 1,
                cover: {
                  $concat: [`${process.env.HOSTING_FILES}`, "/build", "$cover.url", "resolution/", "$cover.filename"],
                },
                slug: {
                  $replaceAll: {
                    input: {
                      $toLower: "$title",
                    },
                    find: " ",
                    replacement: "-",
                  },
                },
              },
            },
          ]);
        }

        return {
          agency: agencyFound[0],
          posts: postsFound,
        };
      } catch (err) {
        console.log(err);
      }
      console.log(uuid);
    },
  },
};
