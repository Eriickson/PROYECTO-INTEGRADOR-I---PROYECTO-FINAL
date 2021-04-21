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
  Province,
  Sector,
  Included,
  TypeModel,
} from "../../../database/models";

export default {
  Mutation: {
    async addAccessories(_: any, { newAccessories }: { newAccessories: IOption[] }) {
      try {
        await Promise.all(
          newAccessories.map(async accesory => {
            const newAccesory = new Accessory({
              label: accesory.label,
            });

            return await newAccesory.save();
          }),
        );

        return "Accesorios agregados";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addFuels(_: any, { newFuels }: { newFuels: IOption[] }) {
      try {
        await Promise.all(
          newFuels.map(async fuel => {
            const newFuel = new Fuel({
              label: fuel.label,
            });

            return await newFuel.save();
          }),
        );

        return "Accesorios agregados";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addFeatures(_: any, { newFeatures }: { newFeatures: IOption[] }) {
      try {
        await Promise.all(
          newFeatures.map(async feature => {
            const newFuel = new Feature({
              label: feature.label,
            });

            return await newFuel.save();
          }),
        );

        return "Características agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addColors(_: any, { newColors }: { newColors: IOption[] }) {
      console.log(newColors);

      try {
        await Promise.all(
          newColors.map(async color => {
            const newFuel = new Color({
              label: color.label,
            });

            return await newFuel.save();
          }),
        );

        return "Características agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addConditions(_: any, { newConditions }: { newConditions: IOption[] }) {
      try {
        await Promise.all(
          newConditions.map(async color => {
            const newFuel = new Condition({
              label: color.label,
            });

            return await newFuel.save();
          }),
        );

        return "Condiciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTractions(_: any, { newTractions }: { newTractions: IOption[] }) {
      try {
        await Promise.all(
          newTractions.map(async color => {
            const newTractions = new Traction({
              label: color.label,
            });

            return await newTractions.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTransmissions(_: any, { newTransmissions }: { newTransmissions: IOption[] }) {
      try {
        await Promise.all(
          newTransmissions.map(async color => {
            const newTransmissions = new Transmission({
              label: color.label,
            });

            return await newTransmissions.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addVehicleCategories(_: any, { newVehicleCategories }: { newVehicleCategories: IOption[] }) {
      try {
        await Promise.all(
          newVehicleCategories.map(async vehicleCategory => {
            const newVehicleCategories = new VehicleCategory({
              label: vehicleCategory.label,
            });

            return await newVehicleCategories.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addBrands(_: any, { newBrands }: { newBrands: IOption[] }) {
      try {
        await Promise.all(
          newBrands.map(async vehicleCategory => {
            const newBrands = new Brand({
              label: vehicleCategory.label,
            });

            return await newBrands.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addModels(_: any, { newModels }: { newModels: { label: string; brand: string }[] }) {
      try {
        await Promise.all(
          newModels.map(async model => {
            const newModels = new Model({
              label: model.label,
              brand: model.brand,
            });

            return await newModels.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addProvinces(_: any, { newProvinces }: { newProvinces: IOption[] }) {
      try {
        await Promise.all(
          newProvinces.map(async province => {
            const newProvinces = new Province({
              label: province.label,
            });

            return await newProvinces.save();
          }),
        );

        return "Traciones agregadas";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addSectors(_: any, { newSectors }: { newSectors: { municipality: string; label: string }[] }) {
      try {
        await Promise.all(
          newSectors.map(async (sector: any) => {
            const newSector = new Sector({
              label: sector.label,
              municipality: sector.municipality,
            });

            return await newSector.save();
          }),
        );

        return "Sectores agregados";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addIncluded(_: any, { newIncluded }: { newIncluded: IOption[] }) {
      try {
        await Promise.all(
          newIncluded.map(async included => {
            const newIncluded = new Included({
              label: included.label,
            });

            return await newIncluded.save();
          }),
        );

        return "Añadidos agregados";
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTypeModel(_: any, { newTypeModel }: { newTypeModel: { brand: string; model: string; label: string }[] }) {
      try {
        await Promise.all(
          newTypeModel.map(async included => {
            const newTypeModel = new TypeModel({
              label: included.label,
              model: included.model,
              brand: included.brand,
            });

            return await newTypeModel.save();
          }),
        );

        return "Tipos de modelos agregados";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
