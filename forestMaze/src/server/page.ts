import { Request, Response } from 'express';
import { join, resolve } from 'path';

const projectRoot = resolve(join(__dirname, '..'));
const mainPage = join(projectRoot, 'index.html');
const loginPage = join(projectRoot, 'login.html');

export function mainPageView(req: Request, res: Response) {
  if (!req.query.name) {
    res.sendFile(loginPage);
    return;
  }
  res.sendFile(mainPage);
}
