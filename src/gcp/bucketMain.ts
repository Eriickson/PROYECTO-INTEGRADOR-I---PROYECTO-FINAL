import storage from "./storage";

export default storage.bucket(`${process.env.BUCKET_NAME}`);
