import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
import { Stream } from "stream";
import { IUpload, IStoredFile } from "../interfaces";

interface IStoreUpload {
  stream: Stream;
  filename?: string;
  mimetype?: string;
}

const storeUpload = async ({ stream }: IStoreUpload): Promise<IStoredFile> => {
  const id = uuid();
  const name = `${id}.jpg`;
  const dir = path.join(process.cwd(), "./images/uploads/", name);
  // (createWriteStream) writes our file to the images directory
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(dir))
      .on("finish", () => resolve({ id, dir, filename: name }))
      .on("error", reject),
  );
};

export async function storeFile(upload: IUpload) {
  const { createReadStream } = upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream });
  return file;
}
