import bucket from "./bucketMain";

export default async function deleteFile(destination: string) {
  try {
    await bucket.file(destination).delete();
  } catch (err) {
    console.log("Ha ocurrido un error al eliminar el archivo", destination);
    console.log(err);
  }
}
