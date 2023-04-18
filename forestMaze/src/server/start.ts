import express, { Request, Response } from 'express';
import { mainPageView, statePageView } from './page';
import { addWebSockets } from './serverSockets';
import { getState, setState } from './state';
import { fileRelativeToRoot } from './root';
import { getUsers } from './user';

const app = express();
const port = 8000;

// Automatically parse request body as a JSON Object
app.use(express.json());

// Serve page views with "authentication"
app.get('/', mainPageView);
app.get('/index.html', mainPageView);

// Serve static assets
app.get('/state.html', statePageView);
['css', 'img', 'lib'].forEach(folder => {
  app.use(`/${folder}`, express.static(fileRelativeToRoot(folder)));
});

// Handle users
app.get('/users', (req: Request, res: Response) => {
  res.send(JSON.stringify(getUsers()));
});

// Handle state
app.get('/state', getState);
app.post('/state', setState);

// Start server
const server = app.listen(port, () => {
  console.log(`Forest maze app listening on port ${port}`)
});
addWebSockets(server);
