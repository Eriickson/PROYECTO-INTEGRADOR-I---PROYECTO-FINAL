import { Types } from "mongoose";
import { ICroppedArea, IDirection, IOption, IUploadPromise } from "../../../interfaces";
import { Agency, User } from "../../../database";
import { uploadLogo } from "../../../utils";
import { fieldDuplicate } from "../../../errors";

interface CreateAgencyArgs {
  agency: {
    name: string;
    slogan: string;
    ubication: {
      direction: IDirection;
    };
    logo: {
      file: IUploadPromise;
      croppedArea: ICroppedArea;
    };
    contacts: {
      numberPhones: IOption[];
      emails: IOption[];
    };
    isProfessional: number;
  };
  userId: string;
}

export default {
  Mutation: {
    async createAgency(_: any, { agency, userId }: CreateAgencyArgs) {
      const { file, croppedArea } = agency.logo;
      let logo;

      try {
        const agencyFoundByName = await Agency.findOne({ name: agency.name });
        if (agencyFoundByName) return new Error(fieldDuplicate("nombre de agencia"));

        const agencyFoundBySlogan = await Agency.findOne({ slogan: agency.slogan });
        if (agencyFoundBySlogan) return new Error(fieldDuplicate("eslogan"));

        logo = await uploadLogo(file, croppedArea);
      } catch (err) {
        throw new Error(err);
      }

      const newAgency = new Agency({
        logo,
        name: agency.name,
        slogan: agency.slogan,
        owner: Types.ObjectId(userId),
        ubication: agency.ubication,
        contacts: agency.contacts,
        isProfessional: agency.isProfessional,
      });

      try {
        await newAgency.save();
        await User.findOneAndUpdate({ _id: userId }, { $set: { agency: newAgency._id } });

        return "Agencia creada";
      } catch (err) {
        console.log(err);

        throw new Error(err);
      }
    },
  },
};
