import path from "path";
import fs from "fs";
import { storeFile, cropImage, resizeImage, createWebp, compressImageExample, moveFile } from "../config";
import { ICroppedArea, IUploadPromise } from "src/interfaces";

export interface IUploadLogoReturn {
  filename: string;
  url: string;
}

export async function uploadLogo(file: IUploadPromise, croppedArea: ICroppedArea): Promise<IUploadLogoReturn> {
  const fileCreated = await file.promise;

  // Almacenamos la imagen
  const { filename } = await storeFile(fileCreated);

  // Recortamos la imagen
  await cropImage(filename, croppedArea);
  await compressImageExample(filename);

  const objRouter = [
    {
      height: 50,
      folder: "x50",
      webp: true,
    },
    {
      height: 250,
      folder: "x250",
      webp: true,
    },
    {
      height: 500,
      folder: "x500",
      webp: true,
    },
  ];

  // Comprimimos todas las imágenes
  const resizeImagesPromises = objRouter.map(({ height, folder }) => {
    return resizeImage(filename, path.join("./images/build/agency/logo/", folder, filename), height);
  });

  await Promise.all(resizeImagesPromises);

  const createWebpPromises = objRouter.map(({ folder }) => {
    return createWebp(`./images/build/agency/logo/${folder}/${filename}`, `./images/build/agency/logo/${folder}`);
  });

  await Promise.all(createWebpPromises);
  // Movemos la imagen original a la caperta full
  moveFile({
    oldPath: path.join(process.cwd(), "/images/uploads/", filename),
    newPath: path.join(process.cwd(), "/images/build/agency/logo", "/full", filename),
  });

  fs.unlinkSync(path.join(process.cwd(), "/images/crop/", filename));
  fs.unlinkSync(path.join(process.cwd(), "/images/compressed/", filename));

  return {
    filename,
    url: "/agency/logo",
  };
}
