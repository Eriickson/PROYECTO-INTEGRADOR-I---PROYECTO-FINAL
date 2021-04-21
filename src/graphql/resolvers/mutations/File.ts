import { uploadFileToClodinary } from "../../../config";
import { IUploadPromise } from "../../../interfaces";
import { storePostImages, IStorePostImagesArgs, uploadProfilePicture, uploadLogo } from "../../../utils";
import { nanoid } from "nanoid";

/* { files: Promise<IUploadPromise>[] } */

export default {
  Mutation: {
    async addFiles(_: any, { files }: { files: IUploadPromise[] }) {
      const filesInternal: IStorePostImagesArgs[] = files.map(file => ({
        file,
        croppedArea: { x: 403, y: 574, width: 3629, height: 2041 },
        id: nanoid(),
      }));

      try {
        const filesUploaded = await storePostImages(filesInternal, "1234567890");

        console.log(filesUploaded);
      } catch (err) {
        console.log(err);
      }
    },
    async addFile(_: any, { file }: { file: IUploadPromise }) {
      const filename = await uploadProfilePicture(file, { height: 400, width: 400, x: 36, y: 0 });
    },
  },
};
