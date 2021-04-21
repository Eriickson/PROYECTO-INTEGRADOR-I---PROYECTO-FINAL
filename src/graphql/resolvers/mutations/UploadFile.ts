import { uploadProfilePicture } from "../../../utils";
import { IUploadPromise, IOption, IUpload } from "src/interfaces";

interface IUploadFileArgs {
  file: IUploadPromise;
  ping: IOption;
}

export default {
  Mutation: {
    async uploadFile(_: any, args: IUploadFileArgs) {
      const file: Promise<IUpload> = args.file.promise;

      // await uploadProfilePicture(file, { height: 400, width: 400, x: 49, y: 0 });
    },
  },
};
