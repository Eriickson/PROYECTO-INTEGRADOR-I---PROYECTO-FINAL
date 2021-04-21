export const envValues = {
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  tokens: {
    tokenLogin: process.env.TOKEN_LOGIN || "",
    tokenAPI: process.env.TOKEN_API || "",
  },
  hostingFiles: process.env.HOSTING_FILES || "",
};
