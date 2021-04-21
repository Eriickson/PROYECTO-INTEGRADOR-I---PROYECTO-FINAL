const compressImages = require("compress-images");

// const input = path.join("./images/uploads/", filename);
async function compressImage(filename) {
  const input = `./images/crop/${filename}`;
  return new Promise((resolve, reject) => {
    compressImages(
      input,
      "./images/compressed/",
      { compress_force: false, statistic: false, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
      { png: { engine: "pngquant", command: ["--quality=20-50"] } },
      { svg: { engine: "svgo", command: "--multipass" } },
      {
        gif: {
          engine: "gifsicle",
          command: ["--colors", "64", "--use-col=web"],
        },
      },
      function (err, completed, statistic) {
        // console.log(statistic);
        if (err) {
          console.log("Path donde se comete el error", input);
          console.log("Este es el error al comprimir", err);
          reject(err);
        }
        if (completed) resolve(filename);
      },
    );
  });
}

export { compressImage };
