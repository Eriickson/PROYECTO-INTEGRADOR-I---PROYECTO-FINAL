import { ReadStream } from "fs";

export interface IUpload {
  createReadStream(): ReadStream;
  filename: string;
  mimetype: string;
  encoding: string;
}

export interface IUploadPromise {
  promise: Promise<IUpload>;
  resolve: () => void;
  reject: () => void;
}

export interface IDirection {
  province: number;
  municipality: number;
  sector: number;
}
