import path from "path";
import sizeOf from "image-size";
import fs from "fs";
import { storeFile, resizeImage, moveFile, cropImage, compressImageExample, createWebp } from "../config";
import { ICroppedArea, IUploadPromise } from "../interfaces";

// import resizeSharp from "./resizeSharp";
// import moveFile from "./moveFile";
// import  from "./deleteImage";
// import { uploadFile } from "../gcp";

const objRouter = [
  {
    height: 100,
    folder: "/x100",
  },
  {
    height: 200,
    folder: "/x200",
  },
  {
    height: 500,
    folder: "/x500",
  },
];

export interface IStorePostImagesArgs {
  id: string;
  file: IUploadPromise;
  croppedArea: ICroppedArea;
}

interface IStoredImage {
  filename: string;
  url: string;
}

interface StorePostImageReturn {
  images: IStoredImage[];
  cover: IStoredImage;
}

export async function storePostImages(files: IStorePostImagesArgs[], cover: string): Promise<StorePostImageReturn> {
  let coverImage: IStoredImage = { filename: "", url: "" };
  const images: IStoredImage[] = await Promise.all(
    files.map(async fileItem => {
      let file: any = await fileItem.file;
      file = await file.promise;
      console.log(fileItem.id);

      // Almacenamos la imagen
      const { filename } = await storeFile(file);

      // Recortamos la imagen
      await cropImage(filename, fileItem.croppedArea);

      // Comprimimos la imagen
      await compressImageExample(filename);

      const input = path.join("./images/compressed", filename);
      const sizeImage = sizeOf(path.join(process.cwd(), "/images/compressed", filename));
      let aspectRatio: number = 0;
      let aspectInfo = {
        folder: "",
        height: 0,
      };
      // Calculamos la relación de aspecto

      if (sizeImage.width && sizeImage.height) {
        aspectRatio = parseFloat((sizeImage.width / sizeImage.height).toFixed(2));
      }

      // Decidimos mediante la relación de aspecto el folder y el alto que tendrá la imagen
      if (aspectRatio >= 1.7) {
        aspectInfo = {
          folder: "x450",
          height: 450,
        };
      } else if (aspectRatio >= 1.3) {
        aspectInfo = {
          folder: "x600",
          height: 600,
        };
      } else if (aspectRatio === 1) {
        aspectInfo = {
          folder: "x800",
          height: 800,
        };
      }

      await Promise.all(
        objRouter.map(
          async ({ folder, height }) =>
            await resizeImage(filename, path.join("./images/build/post/", aspectInfo.folder, folder, filename), height),
        ),
      );

      await Promise.all(
        objRouter.map(async ({ folder }) =>
          createWebp(
            `./images/build/post/${aspectInfo.folder}/${folder}/${filename}`,
            `./images/build/post/${aspectInfo.folder}/${folder}`,
          ),
        ),
      );

      // Movemos la imagen versión full(Sin recortar) y la almacenamos, ya que es una de las que menos pesa
      moveFile({
        oldPath: path.join(process.cwd(), "/images/uploads/", filename),
        newPath: path.join(process.cwd(), "/images/build/post/", aspectInfo.folder, "/full", filename),
      });

      moveFile({
        oldPath: path.join(process.cwd(), "/images/compressed/", filename),
        newPath: path.join(process.cwd(), "/images/build/post/", aspectInfo.folder, "/original", filename),
      });

      // Eliminamos la imagen recortada
      fs.unlinkSync(path.join(process.cwd(), "/images/crop/", filename));

      if (cover === fileItem.id) {
        coverImage = {
          filename,
          url: `/post/${aspectInfo.folder}/`,
        };
      }

      return {
        filename,
        url: `/post/${aspectInfo.folder}/`,
      };
    }),
  );

  return {
    images,
    cover: coverImage,
  };
}
