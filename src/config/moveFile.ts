import fs from "fs";

interface IMoveFile {
  oldPath: string;
  newPath: string;
  callback?: fs.NoParamCallback;
}

export function moveFile({ oldPath, newPath, callback }: IMoveFile): void {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === "EXDEV") {
        copy();
      } else {
        if (callback) callback(err);
      }
      return 0;
    }
  });

  function copy() {
    const readStream = fs.createReadStream(oldPath);
    const writeStream = fs.createWriteStream(newPath);
    if (callback) {
      readStream.on("error", callback);
      writeStream.on("error", callback);
    }

    readStream.on("close", function () {
      if (callback) fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
  }
}
