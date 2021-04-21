import { Types } from "mongoose";
import { IOption } from "src/interfaces";
import { Brand, Model, Post } from "../../../database";
import { getModels, getTypeModel } from "../../../utils";

interface IGetPostArgs {
  uuid: string;
}

interface ISearchPostsArgs {
  searchPostFilter: {
    brand: string;
    model: string;
    typeModel: string;
    category: string;
    minYear: number;
    maxYear: number;
    minPrice: number;
    maxPrice: number;
  };
}

interface IGetMyPostsArgs {
  agencyId: string;
}

export default {
  Query: {
    async getPost(_: any, { uuid }: IGetPostArgs) {
      try {
        const postsFound = await Post.aggregate([
          {
            $match: {
              uuid,
              isDisabled: false,
            },
          },
          { $lookup: { from: "features", localField: "features", foreignField: "_id", as: "features" } },
          { $lookup: { from: "includeds", localField: "includeds", foreignField: "_id", as: "includeds" } },
          { $lookup: { from: "accessories", localField: "accessories", foreignField: "_id", as: "accessories" } },
          { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
          { $lookup: { from: "models", localField: "model", foreignField: "_id", as: "model" } },
          { $lookup: { from: "fuels", localField: "fuel", foreignField: "_id", as: "fuel" } },
          { $lookup: { from: "transmissions", localField: "transmission", foreignField: "_id", as: "transmission" } },
          { $lookup: { from: "colors", localField: "paintColor", foreignField: "_id", as: "paintColor" } },
          { $lookup: { from: "colors", localField: "interiorColor", foreignField: "_id", as: "interiorColor" } },
          { $lookup: { from: "vehiclecategories", localField: "category", foreignField: "_id", as: "category" } },
          { $lookup: { from: "conditions", localField: "condition", foreignField: "_id", as: "condition" } },
          { $lookup: { from: "tractions", localField: "traction", foreignField: "_id", as: "traction" } },
          { $lookup: { from: "agencies", localField: "agency", foreignField: "_id", as: "agency" } },
          { $lookup: { from: "versions", localField: "version", foreignField: "_id", as: "version" } },
          { $unwind: "$brand" },
          { $unwind: "$model" },
          { $unwind: "$fuel" },
          { $unwind: "$transmission" },
          { $unwind: "$paintColor" },
          { $unwind: "$interiorColor" },
          { $unwind: "$category" },
          { $unwind: "$condition" },
          { $unwind: "$traction" },
          { $unwind: "$agency" },
          { $unwind: "$version" },
          {
            $addFields: {
              id: "$_id",
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
              images: {
                $map: {
                  input: "$images",
                  as: "image",
                  in: {
                    $concat: [
                      `${process.env.HOSTING_FILES}`,
                      "/build",
                      "$$image.url",
                      "resolution/",
                      "$$image.filename",
                    ],
                  },
                },
              },
              "agency.slug": {
                $replaceAll: {
                  input: {
                    $toLower: "$agency.name",
                  },
                  find: " ",
                  replacement: "-",
                },
              },
              "agency.logo": {
                $concat: [
                  `${process.env.HOSTING_FILES}`,
                  "/build",
                  "$agency.logo.url",
                  "/resolution/",
                  "$agency.logo.filename",
                ],
              },
            },
          },
        ]);
        console.log(JSON.stringify(postsFound, null, 4));

        if (postsFound.length) {
          await Post.findOneAndUpdate({ _id: postsFound[0]._id }, { visits: postsFound[0].visits + 1 });
        }

        return { post: postsFound[0] };
      } catch (err) {
        console.log(err);
      }
    },
    async getRecentPosts() {
      try {
        const postsFound = await Post.aggregate([
          {
            $match: {
              isDisabled: false,
            },
          },
          {
            $limit: 18,
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $addFields: {
              typeModel: {
                $ifNull: ["$typeModel", Types.ObjectId("60704316ae76964db831d32a")],
              },
            },
          },
          { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
          { $lookup: { from: "models", localField: "model", foreignField: "_id", as: "model" } },
          { $lookup: { from: "typemodels", localField: "typeModel", foreignField: "_id", as: "typeModel" } },
          { $unwind: "$brand" },
          { $unwind: "$model" },
          { $unwind: "$typeModel" },
          {
            $project: {
              id: "$_id",
              uuid: 1,
              brand: 1,
              model: 1,
              typeModel: 1,
              pricing: 1,
              year: 1,
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

        console.log(postsFound);

        return {
          posts: postsFound,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchPosts(_: any, { searchPostFilter }: ISearchPostsArgs) {
      let filter: Record<string, unknown>[] = [{ removedAt: null }, { isDisabled: false }];
      let brandModels: IOption[] = [];
      let typesModels: IOption[] = [];
      const { brand, model, typeModel, category, minYear, maxYear, minPrice, maxPrice } = searchPostFilter;

      if (brand) filter = [...filter, { brandFilter: brand.replace(/ /, "_").toLowerCase() }];
      if (model) filter = [...filter, { modelFilter: model.replace(/ /, "_").toLowerCase() }];
      if (typeModel) filter = [...filter, { typeModelFilter: typeModel.replace(/ /, "_").toLowerCase() }];
      if (category) filter = [...filter, { categoryFilter: category.replace(/ /, "_").toLowerCase() }];
      if (!isNaN(minYear)) filter = [...filter, { year: { $gte: minYear } }];
      if (!isNaN(maxYear)) filter = [...filter, { year: { $lte: maxYear } }];
      if (!isNaN(minPrice)) filter = [...filter, { "pricing.amount": { $gte: minPrice } }];
      if (!isNaN(maxPrice)) filter = [...filter, { "pricing.amount": { $lte: maxPrice } }];

      const postsFound = await Post.aggregate([
        {
          $addFields: {
            typeModel: {
              $ifNull: ["$typeModel", Types.ObjectId("60704316ae76964db831d32a")],
            },
          },
        },
        { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
        { $lookup: { from: "models", localField: "model", foreignField: "_id", as: "model" } },
        { $lookup: { from: "conditions", localField: "condition", foreignField: "_id", as: "condition" } },
        { $lookup: { from: "transmissions", localField: "transmission", foreignField: "_id", as: "transmission" } },
        { $lookup: { from: "vehiclecategories", localField: "category", foreignField: "_id", as: "category" } },
        { $lookup: { from: "typemodels", localField: "typeModel", foreignField: "_id", as: "typeModel" } },
        { $unwind: "$brand" },
        { $unwind: "$model" },
        { $unwind: "$typeModel" },
        { $unwind: "$category" },
        { $unwind: "$condition" },
        { $unwind: "$transmission" },
        { $sort: { createdAt: -1 } },
        { $limit: 20 },
        {
          $addFields: {
            id: "$_id",
            slug: { $toLower: { $replaceAll: { input: "$title", find: " ", replacement: "-" } } },
            brandFilter: { $toLower: { $replaceAll: { input: "$brand.label", find: " ", replacement: "_" } } },
            modelFilter: { $toLower: { $replaceAll: { input: "$model.label", find: " ", replacement: "_" } } },
            typeModelFilter: { $toLower: { $replaceAll: { input: "$typeModel.label", find: " ", replacement: "_" } } },
            categoryFilter: { $toLower: { $replaceAll: { input: "$category.label", find: " ", replacement: "_" } } },
            cover: {
              $concat: [`${process.env.HOSTING_FILES}`, "/build", "$cover.url", "resolution/", "$cover.filename"],
            },
            // isTheOwner: {
            //   $cond: [
            //     { $eq: ["$agency._id", Types.ObjectId(ctx.agencyId)] },
            //     true,
            //     false,
            //   ],
            // },
            images: {
              $map: {
                input: "$images",
                as: "image",
                in: {
                  $concat: [
                    `https://storage.googleapis.com/${process.env.BUCKET_NAME}`,
                    "$$image.url",
                    "$$image.filename",
                  ],
                },
              },
            },
            pricingDop: {
              $cond: [
                { $eq: ["$pricing.currency", "USD"] },
                { $multiply: ["$pricing.amount", 58] },
                { $multiply: ["$pricing.amount", 1] },
              ],
            },
          },
        },
        {
          $match: {
            $and: filter,
          },
        },
      ]);

      if (brand) {
        let brandValue = await Brand.find({ label: { $regex: new RegExp(brand), $options: "i" } });
        brandValue = brandValue[0];

        if (brandValue) {
          brandModels = await getModels(brandValue._id);
        }
      }

      if (model) {
        console.log(model, new RegExp(model));

        let typesModelsValue = await Model.find({
          label: { $regex: new RegExp(model.replace(/-/g, " ")), $options: "i" },
        });
        typesModelsValue = typesModelsValue[0];

        if (typesModelsValue) {
          typesModels = await getTypeModel(typesModelsValue._id);
        }
      }

      return {
        posts: postsFound,
        brandModels,
        typesModels,
      };
    },
    async getMyPosts(_: any, { agencyId }: IGetMyPostsArgs) {
      try {
        const postFounds = await Post.aggregate([
          { $match: { agency: Types.ObjectId(agencyId), isDisabled: false, removeAt: null } },
          { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
          { $lookup: { from: "models", localField: "model", foreignField: "_id", as: "model" } },
          { $unwind: "$brand" },
          { $unwind: "$model" },
          {
            $project: {
              id: "$_id",
              brand: 1,
              model: 1,
              uuid: 1,
              year: 1,
              createdAt: 1,
              pricing: 1,
              visits: 1,
            },
          },
        ]);

        return {
          posts: postFounds,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
