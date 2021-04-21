const { compressImage }: any = require("../js/compressImage");

export async function compressImageExample(filename: string) {
  await compressImage(filename);
}
