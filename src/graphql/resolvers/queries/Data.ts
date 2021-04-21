import {
  getAccessories,
  getFeatures,
  getFuels,
  getColors,
  getConditions,
  getTractions,
  getTransmissions,
  getVersions,
  getVehicleCategories,
  getBrands,
  getModels,
  getIncludeds,
  getTypeModel,
} from "../../../utils";

export default {
  Query: {
    async getAccesories() {
      const response = await getAccessories();

      return response;
    },
    async getFeatures() {
      const response = await getFeatures();

      return response;
    },
    async getFuels() {
      const response = await getFuels();

      return response;
    },
    async getColors() {
      const response = await getColors();

      return response;
    },
    async getConditions() {
      const response = await getConditions();

      return response;
    },
    async getTractions() {
      const response = await getTractions();

      return response;
    },
    async getTransmissions() {
      const response = await getTransmissions();

      return response;
    },
    async getVersions() {
      const response = await getVersions();

      return response;
    },
    async getVehicleCategories() {
      const response = await getVehicleCategories();

      return response;
    },
    async getBrands() {
      const response = await getBrands();

      return response;
    },
    async getModels(_: any, { idBrand }: { idBrand: string }) {
      const response = await getModels(idBrand);

      return response;
    },
    async getIncludeds() {
      const response = await getIncludeds();

      return response;
    },
    async getTypeModel(_: any, { idModel }: { idModel: string }) {
      const response = await getTypeModel(idModel);

      return response;
    },
  },
};
