import cors from "cors";
import express from "express";
import { attachCrosswordEndpoints } from "../crossword/service";
import { htmlFile, readFile } from "./fileSystem";
import { initializeSockets } from "./sockets/initAndAccessSockets";

const app = express();
const port = 6677;

// Automatically parse request body as a JSON Object
app.use(express.json());

app.use(cors());

app.get("/", (_request, response) => {
  const html = readFile(htmlFile("upload.html"));
  response.send(html);
});

attachCrosswordEndpoints(app);

const server = initializeSockets(app);

// Start server
server.listen(port, () => {
  console.log(`Crossword service listening on port ${port}`);
});
