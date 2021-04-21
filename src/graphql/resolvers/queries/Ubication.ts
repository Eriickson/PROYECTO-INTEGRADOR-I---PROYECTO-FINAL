import { Types } from "mongoose";
import { Province, Municipality, Sector, Country } from "../../../database/models";

interface IGetProvincesArgs {
  value?: string;
}
interface IGetMunicipalitiesArgs {
  value?: string;
  provinceId?: string;
}
interface IGetSectorsArgs {
  value?: string;
  municipalityId?: string;
}

export default {
  Query: {
    async getCountries(_: any) {
      try {
        const response = await Country.aggregate([
          {
            $project: {
              value: "$_id",
              label: "$label",
            },
          },
          { $sort: { label: 1 } },
        ]);

        return response;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getProvinces(_: any, { value }: IGetProvincesArgs) {
      try {
        const response = await Province.aggregate([
          {
            $match: {
              $and: [
                value
                  ? {
                      _id: Types.ObjectId(value),
                    }
                  : {},
              ],
            },
          },
          {
            $project: {
              value: "$_id",
              label: "$label",
            },
          },
          { $sort: { label: 1 } },
        ]);

        return response;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getMunicipalities(_: any, { provinceId }: IGetMunicipalitiesArgs) {
      try {
        const response = await Municipality.aggregate([
          {
            $match: {
              province: Types.ObjectId(provinceId),
            },
          },
          {
            $project: {
              value: "$_id",
              label: "$label",
            },
          },
          { $sort: { label: 1 } },
        ]);

        return response;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSectors(_: any, { municipalityId }: IGetSectorsArgs) {
      try {
        const response = await Sector.aggregate([
          {
            $match: {
              municipality: Types.ObjectId(municipalityId),
            },
          },
          {
            $project: {
              value: "$_id",
              label: "$label",
            },
          },
          { $sort: { label: 1 } },
        ]);

        return response;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
