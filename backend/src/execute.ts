import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const executeCode = (
  language: string,
  files: { [filename: string]: string },
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join(__dirname, "code");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Convert the files object to an array of file objects
    const fileArray = Object.keys(files).map((filename) => ({
      filename,
      content: files[filename],
    }));

    fileArray.forEach((file) => {
      fs.writeFileSync(path.join(folderPath, file.filename), file.content);
    });

    const dockerfilePath =
      language === "nodejs"
        ? path.join(__dirname, "../docker/node/Dockerfile")
        : path.join(__dirname, "../docker/python/Dockerfile");
    const dockerImageName =
      language === "nodejs" ? "node-executor" : "python-executor";
    const dockerCommand = `docker build -f ${dockerfilePath} -t ${dockerImageName} ${folderPath} && docker run --rm ${dockerImageName}`;

    console.log(`Docker command: ${dockerCommand}`); // Log the Docker command

    exec(dockerCommand, (error, stdout, stderr) => {
      fs.rmdirSync(folderPath, { recursive: true });

      if (error) {
        console.error(`Error: ${stderr}`);
        resolve(`Error: ${stderr}`);
      } else {
        console.log(`Output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};
