import { Plan } from "../../../database";

export default {
  Mutation: {
    async createPlan(_: any, args: any) {
      console.log(args.plan);

      try {
        const newPlan = new Plan({ ...args.plan });
        await newPlan.save();
        return {
          msg: "Plan creado",
        };
      } catch (err) {
        console.log(err);

        throw new Error("err");
      }
    },
  },
};
