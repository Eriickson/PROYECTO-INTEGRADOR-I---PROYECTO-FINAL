import { Plan } from "../../../database";

export default {
  Query: {
    async getPlans() {
      try {
        const plansFound = await Plan.find().sort("price.amount");

        return {
          plans: plansFound,
        };
      } catch (err) {
        throw new Error("err");
      }
    },
  },
};
