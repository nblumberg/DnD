import cors from "cors";
import express from "express";
import { attachCharacterEndpoints } from "./characters";
import { attachMonsterEndpoints } from "./monsters";

const app = express();
const port = 666;

// Automatically parse request body as a JSON Object
app.use(express.json());

app.use(cors());

attachCharacterEndpoints(app);
attachMonsterEndpoints(app);

// Start server
app.listen(port, () => {
  console.log(`Compendium service listening on port ${port}`);
});
