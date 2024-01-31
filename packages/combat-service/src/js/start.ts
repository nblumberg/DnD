import cors from "cors";
import express from "express";
import { initializeSockets } from "./sockets/initAndAccessSockets";

const app = express();
const port = 6677;

// Automatically parse request body as a JSON Object
app.use(express.json());

app.use(cors());

const server = initializeSockets(app);

// Start server
server.listen(port, () => {
  console.log(`Combat service listening on port ${port}`);
});
