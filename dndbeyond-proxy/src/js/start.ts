import express from "express";
import { addAuthHeader, initAuth } from "./auth";
import { fileRelativeToRoot } from "./root";

const app = express();
const port = 666;

// Automatically parse request body as a JSON Object
app.use(express.json());

// Serve page views with "authentication"
// app.get('/', mainPageView);
// app.get('/index.html', mainPageView);

// Serve static assets
// app.get('/state.html', statePageView);
// app.get('/maze.html', mazePageView);
["css", "img", "lib", "src"].forEach((folder) => {
  app.use(`/${folder}`, express.static(fileRelativeToRoot(folder)));
});

// Handle users
// app.get('/users', (req: Request, res: Response) => {
//   res.send(JSON.stringify(getAllUsers()));
// });

// Handle state
// app.get('/state', getStateEndpoint);
// app.post('/state', setStateEndpoint);

// Settings page
// app.get('/locations', (req, res) => {
//   res.send(getLocations());
// });
// app.get('/encounters', (req, res) => {
//   res.send(getEncounters());
// });

// Start server
const server = app.listen(port, () => {
  console.log(`Forest maze app listening on port ${port}`);
});

initAuth().then(async () => {
  const headers = {};
  addAuthHeader(headers);
  const response = await fetch("https://www.dndbeyond.com/monsters", {
    headers,
  });
  console.log(response.text());
});
// addWebSockets(server);
