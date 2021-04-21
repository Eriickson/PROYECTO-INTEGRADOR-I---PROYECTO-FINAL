import { v2 as cloudinary } from "cloudinary";
import { envValues } from "./envValues";
import path from "path";

cloudinary.config({
  cloud_name: envValues.cloudinary.cloud_name,
  api_key: envValues.cloudinary.api_key,
  api_secret: envValues.cloudinary.api_secret,
});

export async function uploadFileToClodinary(route: string) {
  const routeCloudinary = route;
  route = `./images/build/${route}`;

  try {
    const { secure_url: segureUrl } = await cloudinary.uploader.upload(route, {
      folder: `automarket-rd/${routeCloudinary}`,
    });

    console.log("Subida");

    console.log(segureUrl);
  } catch (err) {
    console.log("Error de cloduinaryt=>", err);
  }
}
