import { Types } from "mongoose";
import { IOption } from "src/interfaces";
import { Province, Municipality, Sector, Nationality, Country } from "../database";

export async function getProvinces(): Promise<IOption[]> {
  const province = await Province.aggregate([
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return province;
}
export async function getNationalities(): Promise<IOption[]> {
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
}

export async function getMunicipalities(idProvince: string): Promise<IOption[]> {
  const municipalities = await Municipality.aggregate([
    {
      $match: { province: Types.ObjectId(idProvince) },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return municipalities;
}

export async function getSectors(idMunicipalities: string): Promise<IOption[]> {
  const sectors = await Sector.aggregate([
    {
      $match: { municipality: Types.ObjectId(idMunicipalities) },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return sectors;
}
