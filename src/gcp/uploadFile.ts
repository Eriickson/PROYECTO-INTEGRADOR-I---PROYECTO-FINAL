import bucket from "./bucketMain";
import path from "path";

interface IUploadFileArgs {
  pathString: string;
  filename: string;
  destination: string;
  metadata: string;
}

async function uploadFile({ pathString, filename, destination, metadata }: IUploadFileArgs) {
  pathString = path.join(process.cwd(), pathString, filename);
  destination = `${destination}${filename}`;

  try {
    await bucket.upload(pathString, { destination });
    await bucket.file(destination).setMetadata({ metadata });
    await bucket.file(destination).makePublic();
  } catch (err) {
    console.log("Ha ocurrido un error al subir los archivos");
    console.log(err);
  }
}

export default uploadFile;
