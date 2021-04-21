import path from "path";
import { storeFile, cropImage, resizeImage, createWebp, compressImageExample, moveFile } from "../config";
import { ICroppedArea, IUploadPromise } from "../interfaces";
import fs from "fs-extra";

const objRouter = [
  {
    height: 50,
    folder: "x50",
  },
  {
    height: 250,
    folder: "x250",
  },
];
export interface IUploadProfilePictureReturn {
  filename: string;
  url: string;
}

export async function uploadProfilePicture(
  file: IUploadPromise,
  croppedArea: ICroppedArea,
): Promise<IUploadProfilePictureReturn> {
  const fileCreated = await file.promise;

  try {
    // Almacenamos la imagen
    const { filename } = await storeFile(fileCreated);

    // Recortamos la imagen
    await cropImage(filename, croppedArea);

    // Comprimimos la imagen
    await compressImageExample(filename);

    // Comprimimos todas las imágenes
    await Promise.all(
      objRouter.map(async ({ height, folder }) => {
        return resizeImage(filename, path.join("./images/build/user/profile/", folder, filename), height);
      }),
    );

    await Promise.all(
      objRouter.map(async ({ folder }) =>
        createWebp(`./images/build/user/profile/${folder}/${filename}`, `./images/build/user/profile/${folder}`),
      ),
    );

    moveFile({
      oldPath: path.join(process.cwd(), "/images/uploads/", filename),
      newPath: path.join(process.cwd(), "/images/build/user/profile", "/full", filename),
    });

    // Eliminamos la imagen recortada
    fs.unlinkSync(path.join(process.cwd(), "/images/crop/", filename));
    fs.unlinkSync(path.join(process.cwd(), "/images/compressed/", filename));

    return {
      filename,
      url: "/user/profile",
    };
  } catch (err) {
    throw new Error(err);
  }
}
