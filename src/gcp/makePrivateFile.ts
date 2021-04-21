import bucket from "./bucketMain";

interface IMakeFilePrivateArgs {
  destination: string;
  metadata: Record<string, string>;
}

export default async function makeFilePrivate({ destination, metadata }: IMakeFilePrivateArgs) {
  // Seteamos la metadata al archivo y luego lo hacemos privado
  await bucket.file(destination).setMetadata({ metadata });
  await bucket.file(destination).makePrivate();
}
