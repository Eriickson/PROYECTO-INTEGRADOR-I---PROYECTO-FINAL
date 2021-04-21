import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";

export type AcceptedExtensions = "JPG" | "PNG" | "JPEG";

export async function createWebp(input: string, output: string, quality: number = 75): Promise<void> {
  await imagemin([input], {
    destination: output,
    plugins: [
      imageminWebp({
        quality,
      }),
    ],
  });
}

async function convertImageToWebp(filename: string, quality: number): Promise<void> {
  await imagemin([`./images/crop/${filename}`], {
    destination: "./images/compressed/",
    plugins: [
      imageminWebp({
        quality,
      }),
    ],
  });
}

export async function optimiseJPEGImages(filename: string) {
  await imagemin([`./images/crop/${filename}`], {
    destination: "./images/compressed/",
    plugins: [imageminMozjpeg({ quality: 9 })],
  });
}

export async function optimisePNGImage(filename: string) {
  imagemin([`./images/cropped/${filename}`], {
    destination: "./images/compressed/",
    plugins: [imageminPngquant({ quality: [65, 80] })],
  });
}

export async function compressImage(input: string): Promise<void> {
  convertImageToWebp(input, 75);
}

// x25, x250, full
// x25-webp, x250-webp, full-webp
