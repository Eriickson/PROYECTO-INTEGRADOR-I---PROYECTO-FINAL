import sharp from "sharp";
import path from "path";

export async function resizeImage(
  filename: string,
  output: string,
  height: number | undefined,
  width: number | undefined = undefined,
): Promise<void> {
  const input = path.join("./images/compressed/", filename);
  try {
    await sharp(input).resize({ width, height }).toFile(output);
  } catch (err) {
    console.log("Error al redimencionar", err);

    throw new Error("Ha ocurrido un error al redimencionar la imagen");
  }
}
