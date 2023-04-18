import { Request, Response } from 'express';
import { join } from 'path';
import { parsePageQuery } from './state';
import { fileRelativeToRoot } from './root';

const htmlDirectory = fileRelativeToRoot('html');
const mainPage = join(htmlDirectory, 'index.html');
const loginPage = join(htmlDirectory, 'login.html');
const statePage = join(htmlDirectory, 'state.html');

export function mainPageView(req: Request, res: Response) {
  if (!req.query.name) {
    res.sendFile(loginPage);
    return;
  }
  parsePageQuery(req.query);
  res.sendFile(mainPage);
}

export function statePageView(_req: Request, res: Response) {
  res.sendFile(statePage);
}
