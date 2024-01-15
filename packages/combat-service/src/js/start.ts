import * as cors from "cors";
import * as express from "express";
import { attachCastMemberEndpoints } from "./castMembers";

const app = express();
const port = 6677;

// Automatically parse request body as a JSON Object
app.use(express.json());

app.use(cors());

attachCastMemberEndpoints(app);

// Start server
app.listen(port, () => {
  console.log(`Combat service listening on port ${port}`);
});
