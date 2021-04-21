import { Types } from "mongoose";
import { IOption } from "src/interfaces";
import {
  Accessory,
  Feature,
  Fuel,
  Color,
  Condition,
  Traction,
  Transmission,
  Version,
  VehicleCategory,
  Brand,
  Model,
  Included,
  TypeModel,
} from "../database";

export async function getAccessories(): Promise<IOption[]> {
  const response = await Accessory.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getFeatures(): Promise<IOption[]> {
  const response = await Feature.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getFuels(): Promise<IOption[]> {
  const response = await Fuel.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getColors(): Promise<IOption[]> {
  const response = await Color.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getConditions(): Promise<IOption[]> {
  const response = await Condition.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getTractions(): Promise<IOption[]> {
  const response = await Traction.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getTransmissions(): Promise<IOption[]> {
  const response = await Transmission.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getVersions(): Promise<IOption[]> {
  const response = await Version.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getVehicleCategories(): Promise<IOption[]> {
  const response = await VehicleCategory.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getBrands(): Promise<IOption[]> {
  const response = await Brand.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getModels(idBrand: string): Promise<IOption[]> {
  const response = await Model.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $match: {
        brand: Types.ObjectId(idBrand),
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);

  return response;
}

export async function getIncludeds(): Promise<IOption[]> {
  const response = await Included.aggregate([
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);
  return response;
}

export async function getTypeModel(idModel?: string): Promise<IOption[]> {
  const response = await TypeModel.aggregate([
    {
      $match: {
        model: Types.ObjectId(idModel),
      },
    },
    {
      $sort: {
        label: 1,
      },
    },
    {
      $addFields: {
        value: "$_id",
      },
    },
  ]);

  return response;
}
