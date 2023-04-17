import express from 'express';
import { join, resolve } from 'path';
import { mainPageView } from './page';
import { addUser, getUsers, removeUser } from './user';

const app = express();
const port = 8000;
const projectRoot = resolve(join(__dirname, '..'));

// Automatically parse request body as a JSON Object
app.use(express.json());

// Serve static assets
app.use('/lib', express.static(join(projectRoot, 'lib')));
app.use('/style.css', express.static(join(projectRoot, 'style.css')));

// Serve page views with "authentication"
app.get('/', mainPageView);
app.get('/index.html', mainPageView);

// Handle users
app.get('/users', getUsers);
app.post('/login', addUser);
app.delete('/users/:userId', removeUser);

// Start server
app.listen(port, () => {
  console.log(`Forest maze app listening on port ${port}`)
});
