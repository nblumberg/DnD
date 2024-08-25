import axios from "axios";
import fs from "node:fs";

export async function saveImage(url: string, file: string): Promise<void> {
  const response = await axios({
    url,
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(file))
      .on("finish", () => resolve())
      .on("error", (e) => reject(e));
  });
}
