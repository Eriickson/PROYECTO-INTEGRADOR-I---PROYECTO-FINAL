import sharp from "sharp";
import path from "path";
import { ICroppedArea } from "../interfaces";

const input = "./images/uploads";
const output = "./images/crop";

export async function cropImage(filename: string, cropArea: ICroppedArea): Promise<void> {
  try {
    await sharp(path.join(input, filename))
      .extract({
        width: Math.round(cropArea.width),
        height: Math.round(cropArea.height),
        left: Math.round(cropArea.x),
        top: Math.round(cropArea.y),
      })
      .rotate(0)
      .toFile(path.join(output, filename));
  } catch (err) {
    console.log("Ha ocurrido un error", err);
  }
}
